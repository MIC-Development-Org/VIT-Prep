import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import {
  isAllowedContentType,
  validateFileDetails,
} from '@/lib/file-validation';
import {
  createObjectKey,
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
    return NextResponse.json({ error: 'Invalid upload details.' }, { status: 400 });
  }
  const { filename, contentType, size } = input as Record<string, unknown>;
  const validationError = validateFileDetails(filename, contentType, size);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }
  if (typeof contentType !== 'string' || !isAllowedContentType(contentType)) {
    return NextResponse.json({ error: 'Unsupported content type.' }, { status: 400 });
  }

  try {
    const objectKey = createObjectKey(userId, filename as string);
    return NextResponse.json({
      objectKey,
      uploadUrl: `/api/upload/file?objectKey=${encodeURIComponent(objectKey)}`,
      downloadUrl: maskedDownloadPath(objectKey),
    });
  } catch {
    return NextResponse.json({ error: 'Unable to allocate upload.' }, { status: 500 });
  }
}
