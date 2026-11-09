import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { uploadRecords } from '@/db/schema';
import { getAuthenticatedUser } from '@/lib/auth';
import {
  hasValidFileSignature,
  isAllowedContentType,
  contentTypeMatchesFilename,
  isValidFilename,
  MAX_FILE_SIZE,
} from '@/lib/file-validation';
import {
  isObjectKeyOwnedByUser,
  objectKeyMatchesFilename,
  uploadObject,
} from '@/lib/storage';

const MAX_MULTIPART_SIZE = MAX_FILE_SIZE + 1024 * 1024;

export async function POST(request: Request) {
  const userId = await getAuthenticatedUser(request);
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const objectKey = new URL(request.url).searchParams.get('objectKey');
  if (!objectKey || !isObjectKeyOwnedByUser(objectKey, userId)) {
    return NextResponse.json({ error: 'Invalid upload allocation.' }, { status: 403 });
  }

  try {
    const [existingRecord] = await getDb()
      .select({ id: uploadRecords.id })
      .from(uploadRecords)
      .where(eq(uploadRecords.objectKey, objectKey))
      .limit(1);
    if (existingRecord) {
      return NextResponse.json({ error: 'This upload has already been completed.' }, { status: 409 });
    }
  } catch (error) {
    console.error('Upload record lookup failed.', error);
    return NextResponse.json({ error: 'Upload is temporarily unavailable.' }, { status: 503 });
  }

  const contentLength = Number(request.headers.get('content-length'));
  if (!Number.isSafeInteger(contentLength) || contentLength < 1) {
    return NextResponse.json({ error: 'A valid upload size is required.' }, { status: 411 });
  }
  if (contentLength > MAX_MULTIPART_SIZE) {
    return NextResponse.json({ error: 'Upload exceeds the 25 MB file limit.' }, { status: 413 });
  }

  const reader = request.body?.getReader();
  if (!reader) {
    return NextResponse.json({ error: 'Upload body is required.' }, { status: 400 });
  }
  const chunks: Uint8Array[] = [];
  let received = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (received > MAX_MULTIPART_SIZE) {
        await reader.cancel();
        return NextResponse.json({ error: 'Upload exceeds the 25 MB file limit.' }, { status: 413 });
      }
      chunks.push(value);
    }
  } catch {
    return NextResponse.json({ error: 'Unable to read upload body.' }, { status: 400 });
  }

  if (received !== contentLength) {
    return NextResponse.json({ error: 'Upload size does not match Content-Length.' }, { status: 400 });
  }

  const requestBody = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    requestBody.set(chunk, offset);
    offset += chunk.byteLength;
  }

  let formData: FormData;
  try {
    const limitedRequest = new Request(request.url, {
      method: 'POST',
      headers: request.headers,
      body: new Blob([requestBody]),
    });
    formData = await limitedRequest.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid multipart upload.' }, { status: 400 });
  }

  const files = formData.getAll('file');
  if (
    files.length !== 1 ||
    [...formData.keys()].some((key) => key !== 'file') ||
    !(files[0] instanceof File)
  ) {
    return NextResponse.json({ error: 'A file is required.' }, { status: 400 });
  }
  const file = files[0];
  if (!isValidFilename(file.name) || !objectKeyMatchesFilename(objectKey, file.name)) {
    return NextResponse.json({ error: 'Filename does not match the upload allocation.' }, { status: 400 });
  }
  if (file.size < 1 || file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File size must be between 1 byte and 25 MB.' }, { status: 400 });
  }
  if (!isAllowedContentType(file.type)) {
    return NextResponse.json({ error: 'Unsupported content type.' }, { status: 400 });
  }
  if (!contentTypeMatchesFilename(file.name, file.type)) {
    return NextResponse.json({ error: 'Filename extension does not match the content type.' }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  if (!hasValidFileSignature(bytes, file.type)) {
    return NextResponse.json({ error: 'File content does not match its content type.' }, { status: 400 });
  }

  try {
    await uploadObject(objectKey, bytes, file.type);
  } catch (error) {
    console.error('B2 upload failed.', error);
    return NextResponse.json({ error: 'File upload failed.' }, { status: 502 });
  }

  return NextResponse.json({
    objectKey,
    size: bytes.length,
    contentType: file.type,
    status: 'UPLOADED',
  });
}
