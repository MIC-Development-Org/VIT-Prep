import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getDb } from '@/db/client';
import { getAuthenticatedUser } from '@/lib/auth';
import { uploadRecords } from '@/db/schema';
import { getObjectStream, isMissingStorageObject } from '@/lib/storage';

export async function GET(
  request: Request,
  context: { params: Promise<{ objectKey: string[] }> },
) {
  const userId = await getAuthenticatedUser(request);
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const { objectKey: keyParts } = await context.params;
  const objectKey = keyParts.join('/');
  let record;
  try {
    [record] = await getDb()
      .select({
        objectKey: uploadRecords.objectKey,
        uploaderId: uploadRecords.uploaderId,
        originalFilename: uploadRecords.originalFilename,
        contentType: uploadRecords.contentType,
        size: uploadRecords.size,
        status: uploadRecords.status,
      })
      .from(uploadRecords)
      .where(eq(uploadRecords.objectKey, objectKey))
      .limit(1);
  } catch (error) {
    console.error('Upload record lookup failed.', error);
    return NextResponse.json({ error: 'File access is temporarily unavailable.' }, { status: 503 });
  }

  if (!record) {
    return NextResponse.json({ error: 'File not found.' }, { status: 404 });
  }
  if (record.uploaderId !== userId && record.status !== 'APPROVED') {
    return NextResponse.json({ error: 'File not found.' }, { status: 404 });
  }

  try {
    const { stream, contentLength } = await getObjectStream(record.objectKey);
    const fallbackName = record.originalFilename
      .replace(/[^\x20-\x7e]/g, '_')
      .replace(/["\\;]/g, '_');
    const encodedName = encodeURIComponent(record.originalFilename).replace(
      /['()*]/g,
      (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
    );
    return new Response(stream, {
      headers: {
        'Content-Type': record.contentType,
        'Content-Length': String(contentLength ?? record.size),
        'Content-Disposition': `attachment; filename="${fallbackName}"; filename*=UTF-8''${encodedName}`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if (isMissingStorageObject(error)) {
      return NextResponse.json({ error: 'File not found.' }, { status: 404 });
    }
    console.error('B2 object retrieval failed.', error);
    return NextResponse.json({ error: 'File could not be retrieved.' }, { status: 502 });
  }
}
