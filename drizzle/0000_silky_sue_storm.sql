CREATE TABLE "upload_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uploader_id" varchar(80) NOT NULL,
	"object_key" text NOT NULL,
	"original_filename" varchar(255) NOT NULL,
	"content_type" varchar(127) NOT NULL,
	"size" integer NOT NULL,
	"status" varchar(32) DEFAULT 'PENDING' NOT NULL,
	"file_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "upload_records_object_key_unique" UNIQUE("object_key")
);
