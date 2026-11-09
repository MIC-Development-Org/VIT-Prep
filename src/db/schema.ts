import {
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const uploadRecords = pgTable(
  'upload_records',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    uploaderId: varchar('uploader_id', { length: 80 }).notNull(),
    objectKey: text('object_key').notNull(),
    originalFilename: varchar('original_filename', { length: 255 }).notNull(),
    contentType: varchar('content_type', { length: 127 }).notNull(),
    size: integer('size').notNull(),
    status: varchar('status', { length: 32 }).notNull().default('PENDING'),
    fileUrl: text('file_url').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [unique('upload_records_object_key_unique').on(table.objectKey)],
);
