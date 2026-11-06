import 'server-only';

import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';
import { Readable } from 'node:stream';
import type { AllowedContentType } from './file-validation';

let client: S3Client | undefined;

function getStorageConfig() {
  const {
    B2_ENDPOINT,
    B2_REGION,
    B2_BUCKET_NAME,
    B2_KEY_ID,
    B2_APPLICATION_KEY,
  } = process.env;
  if (!B2_ENDPOINT || !B2_REGION || !B2_BUCKET_NAME || !B2_KEY_ID || !B2_APPLICATION_KEY) {
    throw new Error('Backblaze B2 storage is not configured.');
  }
  return {
    endpoint: B2_ENDPOINT,
    region: B2_REGION,
    bucket: B2_BUCKET_NAME,
    accessKeyId: B2_KEY_ID,
    secretAccessKey: B2_APPLICATION_KEY,
  };
}

function getClient(): S3Client {
  if (!client) {
    const config = getStorageConfig();
    client = new S3Client({
      endpoint: config.endpoint,
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }
  return client;
}

export function safeUserId(userId: string): string {
  if (!userId || Buffer.byteLength(userId, 'utf8') > 80) {
    throw new Error('Authenticated user ID is invalid.');
  }
  return Buffer.from(userId, 'utf8').toString('base64url');
}

export function objectKeyPrefix(userId: string): string {
  return `uploads/${safeUserId(userId)}/`;
}

function safeFilename(filename: string): string {
  return (
    filename
      .normalize('NFKD')
      .replace(/[^A-Za-z0-9._-]/g, '_')
      .replace(/\.{2,}/g, '.')
      .slice(-180) || 'file'
  );
}

export function createObjectKey(userId: string, filename: string): string {
  return `${objectKeyPrefix(userId)}${randomUUID()}-${safeFilename(filename)}`;
}

export function objectKeyMatchesFilename(objectKey: string, filename: string): boolean {
  return objectKey.endsWith(`-${safeFilename(filename)}`);
}

export function isObjectKeyOwnedByUser(objectKey: string, userId: string): boolean {
  const filename = objectKey.slice(objectKeyPrefix(userId).length);
  return (
    objectKey.startsWith(objectKeyPrefix(userId)) &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-[A-Za-z0-9._-]+$/i.test(
      filename,
    )
  );
}

export function maskedDownloadPath(objectKey: string): string {
  return `/api/upload/download/${objectKey.split('/').map(encodeURIComponent).join('/')}`;
}

export async function uploadObject(
  objectKey: string,
  body: Buffer,
  contentType: AllowedContentType,
): Promise<void> {
  const config = getStorageConfig();
  await getClient().send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: objectKey,
      Body: body,
      ContentLength: body.length,
      ContentType: contentType,
    }),
  );
}

export async function getObjectMetadata(objectKey: string) {
  const config = getStorageConfig();
  return getClient().send(
    new HeadObjectCommand({ Bucket: config.bucket, Key: objectKey }),
  );
}

export async function getObjectPrefix(objectKey: string, length = 32): Promise<Buffer> {
  const config = getStorageConfig();
  const response = await getClient().send(
    new GetObjectCommand({
      Bucket: config.bucket,
      Key: objectKey,
      Range: `bytes=0-${Math.max(0, length - 1)}`,
    }),
  );
  if (!response.Body) throw new Error('Stored object has no readable body.');
  return Buffer.from(await response.Body.transformToByteArray());
}

export async function getObjectStream(objectKey: string) {
  const config = getStorageConfig();
  const response = await getClient().send(
    new GetObjectCommand({ Bucket: config.bucket, Key: objectKey }),
  );
  if (!response.Body) throw new Error('Stored object has no readable body.');
  const body = response.Body;
  const stream =
    body instanceof Readable
      ? Readable.toWeb(body) as ReadableStream<Uint8Array>
      : body.transformToWebStream();
  return { stream, contentLength: response.ContentLength };
}

export async function deleteObject(objectKey: string): Promise<void> {
  const config = getStorageConfig();
  await getClient().send(
    new DeleteObjectCommand({ Bucket: config.bucket, Key: objectKey }),
  );
}

export function isMissingStorageObject(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const storageError = error as {
    name?: string;
    Code?: string;
    $metadata?: { httpStatusCode?: number };
  };
  return (
    storageError.name === 'NoSuchKey' ||
    storageError.name === 'NotFound' ||
    storageError.Code === 'NoSuchKey' ||
    storageError.$metadata?.httpStatusCode === 404
  );
}
