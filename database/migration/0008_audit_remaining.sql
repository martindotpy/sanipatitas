CREATE TABLE IF NOT EXISTS "immunization_aud" (
	"id" uuid NOT NULL,
	"rev" bigint NOT NULL,
	"revtype" smallint,
	"vaccine_code" varchar(100),
	"vaccine_name" varchar(255),
	"manufacturer" varchar(255),
	"lot_number" varchar(255),
	"expiration_date" timestamp (6) with time zone,
	"administration_date" timestamp (6) with time zone,
	"dose_number" varchar(50),
	"dose_unit" varchar(50),
	"route" varchar(20),
	"site" varchar(255),
	"reaction" varchar(2000),
	"status" varchar(20),
	"created_at" timestamp (6) with time zone,
	"updated_at" timestamp (6) with time zone,
	"patient_id" uuid,
	"veterinarian_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medical_observation_aud" (
	"id" uuid NOT NULL,
	"rev" bigint NOT NULL,
	"revtype" smallint,
	"code" varchar(255),
	"value" varchar(2000),
	"unit" varchar(100),
	"interpretation" varchar(255),
	"body_site" varchar(255),
	"method" varchar(255),
	"reference_range" varchar(500),
	"category" varchar(20),
	"status" varchar(20),
	"issued_date" timestamp (6) with time zone,
	"created_at" timestamp (6) with time zone,
	"updated_at" timestamp (6) with time zone,
	"patient_id" uuid,
	"veterinarian_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prescription_aud" (
	"id" uuid NOT NULL,
	"rev" bigint NOT NULL,
	"revtype" smallint,
	"issue_date" timestamp (6) with time zone,
	"expiration_date" timestamp (6) with time zone,
	"notes" varchar(2000),
	"status" varchar(20),
	"created_at" timestamp (6) with time zone,
	"updated_at" timestamp (6) with time zone,
	"patient_id" uuid,
	"veterinarian_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prescription_item_aud" (
	"id" uuid NOT NULL,
	"rev" bigint NOT NULL,
	"revtype" smallint,
	"medication_name" varchar(255),
	"dosage" varchar(100),
	"frequency" varchar(100),
	"duration" varchar(100),
	"route" varchar(100),
	"notes" varchar(2000),
	"created_at" timestamp (6) with time zone,
	"updated_at" timestamp (6) with time zone,
	"prescription_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "procedure_aud" (
	"id" uuid NOT NULL,
	"rev" bigint NOT NULL,
	"revtype" smallint,
	"code" varchar(20),
	"name" varchar(255),
	"category" varchar(20),
	"reason" varchar(2000),
	"outcome" varchar(2000),
	"complications" varchar(2000),
	"performed_date" timestamp (6) with time zone,
	"status" varchar(20),
	"created_at" timestamp (6) with time zone,
	"updated_at" timestamp (6) with time zone,
	"patient_id" uuid,
	"veterinarian_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_aud" (
	"id" uuid NOT NULL,
	"rev" bigint NOT NULL,
	"revtype" smallint,
	"name" varchar(255),
	"code" varchar(100),
	"description" varchar(2000),
	"price" numeric(10, 2),
	"created_at" timestamp (6) with time zone,
	"updated_at" timestamp (6) with time zone,
	"category_id" uuid,
	"supplier_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_category_aud" (
	"id" uuid NOT NULL,
	"rev" bigint NOT NULL,
	"revtype" smallint,
	"name" varchar(255),
	"description" varchar(1000),
	"created_at" timestamp (6) with time zone,
	"updated_at" timestamp (6) with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock_aud" (
	"id" uuid NOT NULL,
	"rev" bigint NOT NULL,
	"revtype" smallint,
	"quantity" integer,
	"location" varchar(255),
	"min_stock" integer,
	"created_at" timestamp (6) with time zone,
	"updated_at" timestamp (6) with time zone,
	"product_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock_movement_aud" (
	"id" uuid NOT NULL,
	"rev" bigint NOT NULL,
	"revtype" smallint,
	"type" varchar(20),
	"quantity" integer,
	"unit_cost" numeric(10, 2),
	"unit_price" numeric(10, 2),
	"discount" numeric(10, 2),
	"reference" varchar(255),
	"notes" varchar(500),
	"created_at" timestamp (6) with time zone,
	"stock_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supplier_aud" (
	"id" uuid NOT NULL,
	"rev" bigint NOT NULL,
	"revtype" smallint,
	"name" varchar(255),
	"ruc" varchar(20),
	"contact_name" varchar(255),
	"contact_phone" varchar(50),
	"email" varchar(255),
	"address" varchar(500),
	"created_at" timestamp (6) with time zone,
	"updated_at" timestamp (6) with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "billing_aud" (
	"id" uuid NOT NULL,
	"rev" bigint NOT NULL,
	"revtype" smallint,
	"client_id" uuid,
	"appointment_id" uuid,
	"subtotal" numeric(10, 2),
	"discount" numeric(10, 2),
	"tax_amount" numeric(10, 2),
	"total_amount" numeric(10, 2),
	"payment_status" varchar(20),
	"invoice_number" varchar(50),
	"notes" varchar(500),
	"created_at" timestamp (6) with time zone,
	"updated_at" timestamp (6) with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "billing_item_aud" (
	"id" uuid NOT NULL,
	"rev" bigint NOT NULL,
	"revtype" smallint,
	"billing_id" uuid,
	"description" varchar(255),
	"quantity" integer,
	"unit_price" numeric(10, 2),
	"total" numeric(10, 2),
	"item_type" varchar(20),
	"reference_id" uuid,
	"created_at" timestamp (6) with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment_aud" (
	"id" uuid NOT NULL,
	"rev" bigint NOT NULL,
	"revtype" smallint,
	"billing_id" uuid,
	"amount" numeric(10, 2),
	"payment_method" varchar(20),
	"reference" varchar(255),
	"paid_at" timestamp (6) with time zone,
	"notes" varchar(500),
	"created_at" timestamp (6) with time zone
);
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "immunization_aud" ADD CONSTRAINT "immunization_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "medical_observation_aud" ADD CONSTRAINT "medical_observation_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "prescription_aud" ADD CONSTRAINT "prescription_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "prescription_item_aud" ADD CONSTRAINT "prescription_item_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "procedure_aud" ADD CONSTRAINT "procedure_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "product_aud" ADD CONSTRAINT "product_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "product_category_aud" ADD CONSTRAINT "product_category_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "stock_aud" ADD CONSTRAINT "stock_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "stock_movement_aud" ADD CONSTRAINT "stock_movement_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "supplier_aud" ADD CONSTRAINT "supplier_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "billing_aud" ADD CONSTRAINT "billing_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "billing_item_aud" ADD CONSTRAINT "billing_item_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "payment_aud" ADD CONSTRAINT "payment_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
