import 'server-only';

export const MAX_FILE_SIZE = 25 * 1024 * 1024;

export const ALLOWED_CONTENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/png',
  'image/jpeg',
  'image/webp',
] as const;

export type AllowedContentType = (typeof ALLOWED_CONTENT_TYPES)[number];

const extensionContentTypes: Record<string, AllowedContentType> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
};

const OLE_SIGNATURE = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);

export function isAllowedContentType(value: string): value is AllowedContentType {
  return ALLOWED_CONTENT_TYPES.includes(value as AllowedContentType);
}

export function isValidFilename(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    Buffer.byteLength(value, 'utf8') <= 255 &&
    value !== '.' &&
    value !== '..' &&
    !/[\/\\\0-\x1f\x7f]/.test(value)
  );
}

export function contentTypeMatchesFilename(filename: string, contentType: string): boolean {
  const extension = filename.split('.').pop()?.toLowerCase();
  return Boolean(extension && extensionContentTypes[extension] === contentType);
}

export function validateFileDetails(
  filename: unknown,
  contentType: unknown,
  size: unknown,
): string | null {
  if (!isValidFilename(filename)) return 'Invalid filename.';
  if (typeof contentType !== 'string' || !isAllowedContentType(contentType)) {
    return 'Unsupported content type.';
  }
  if (!contentTypeMatchesFilename(filename, contentType)) {
    return 'Filename extension does not match the content type.';
  }
  if (!Number.isSafeInteger(size) || (size as number) < 1 || (size as number) > MAX_FILE_SIZE) {
    return 'File size must be between 1 byte and 25 MB.';
  }
  return null;
}

export function hasValidFileSignature(
  bytes: Uint8Array,
  contentType: AllowedContentType,
): boolean {
  if (contentType === 'application/pdf') {
    return bytes.length >= 5 && Buffer.from(bytes.subarray(0, 5)).equals(Buffer.from('%PDF-'));
  }
  if (contentType === 'image/png') {
    return (
      bytes.length >= 8 &&
      Buffer.from(bytes.subarray(0, 8)).equals(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      )
    );
  }
  if (contentType === 'image/jpeg') {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (contentType === 'image/webp') {
    return (
      bytes.length >= 12 &&
      Buffer.from(bytes.subarray(0, 4)).equals(Buffer.from('RIFF')) &&
      Buffer.from(bytes.subarray(8, 12)).equals(Buffer.from('WEBP'))
    );
  }
  if (
    contentType === 'application/msword' ||
    contentType === 'application/vnd.ms-powerpoint'
  ) {
    return (
      bytes.length >= OLE_SIGNATURE.length &&
      Buffer.from(bytes.subarray(0, 8)).equals(OLE_SIGNATURE)
    );
  }
  return (
    (contentType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      contentType ===
        'application/vnd.openxmlformats-officedocument.presentationml.presentation') &&
    bytes.length >= 4 &&
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    [0x03, 0x05, 0x07].includes(bytes[2]) &&
    [0x04, 0x06, 0x08].includes(bytes[3])
  );
}
