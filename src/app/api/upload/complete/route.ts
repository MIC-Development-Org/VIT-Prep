import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import {
  contentTypeMatchesFilename,
  hasValidFileSignature,
  isAllowedContentType,
  isValidFilename,
  MAX_FILE_SIZE,
} from '@/lib/file-validation';
import { getDb } from '@/db/client';
import { uploadRecords } from '@/db/schema';
import {
  deleteObject,
  getObjectMetadata,
  getObjectPrefix,
  isObjectKeyOwnedByUser,
  objectKeyMatchesFilename,
  isMissingStorageObject,
  maskedDownloadPath,
} from '@/lib/storage';

export async function POST(request: Request) {
  const userId = await getAuthenticatedUser(request);
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request.' }, { status: 400 });
  }
  if (!input || typeof input !== 'object') {
    return NextResponse.json({ error: 'Invalid completion details.' }, { status: 400 });
  }

  const { objectKey, originalFilename, contentType, expectedSize } =
    input as Record<string, unknown>;
  if (
    typeof objectKey !== 'string' ||
    !isObjectKeyOwnedByUser(objectKey, userId) ||
    !isValidFilename(originalFilename) ||
    !objectKeyMatchesFilename(objectKey, originalFilename) ||
    typeof contentType !== 'string' ||
    !isAllowedContentType(contentType) ||
    !contentTypeMatchesFilename(originalFilename, contentType) ||
    !Number.isSafeInteger(expectedSize) ||
    (expectedSize as number) < 1 ||
    (expectedSize as number) > MAX_FILE_SIZE
  ) {
    return NextResponse.json({ error: 'Invalid upload completion details.' }, { status: 400 });
  }

  let metadata;
  try {
    metadata = await getObjectMetadata(objectKey);
  } catch (error) {
    if (isMissingStorageObject(error)) {
      return NextResponse.json({ error: 'Uploaded object was not found.' }, { status: 404 });
    }
    console.error('B2 metadata lookup failed.', error);
    return NextResponse.json({ error: 'Uploaded file could not be verified.' }, { status: 502 });
  }

  const invalidateObject = async (message: string) => {
    try {
      await deleteObject(objectKey);
    } catch (error) {
      console.error('Failed to remove invalid B2 object.', error);
      return NextResponse.json({ error: 'Invalid file detected; cleanup failed.' }, { status: 502 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  };

  if (
    metadata.ContentLength !== expectedSize ||
    metadata.ContentType !== contentType
  ) {
    return invalidateObject('Stored file metadata does not match the upload.');
  }

  let signatureValid: boolean;
  try {
    const prefix = await getObjectPrefix(objectKey);
    signatureValid = hasValidFileSignature(prefix, contentType);
  } catch (error) {
    if (isMissingStorageObject(error)) {
      return NextResponse.json({ error: 'Uploaded object was not found.' }, { status: 404 });
    }
    console.error('B2 signature verification failed.', error);
    return NextResponse.json({ error: 'Uploaded file could not be verified.' }, { status: 502 });
  }
  if (!signatureValid) {
    return invalidateObject('Stored file content does not match its declared type.');
  }

  const fileUrl = maskedDownloadPath(objectKey);
  try {
    const [record] = await getDb()
      .insert(uploadRecords)
      .values({
        uploaderId: userId,
        objectKey,
        originalFilename,
        contentType,
        size: expectedSize as number,
        status: 'PENDING',
        fileUrl,
      })
      .onConflictDoNothing({ target: uploadRecords.objectKey })
      .returning({
        id: uploadRecords.id,
        status: uploadRecords.status,
        fileUrl: uploadRecords.fileUrl,
        createdAt: uploadRecords.createdAt,
      });

    if (!record) {
      return NextResponse.json({ error: 'This upload has already been completed.' }, { status: 409 });
    }
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('Upload metadata persistence failed.', error);
    return NextResponse.json({ error: 'Upload metadata could not be saved.' }, { status: 503 });
  }
}
