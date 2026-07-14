CREATE TABLE IF NOT EXISTS "immunization_aud" (
	"id" uuid NOT NULL,
	"rev" bigint NOT NULL,
	"revtype" smallint,
	"vaccine_code" varchar(100),
	"vaccine_name" varchar(255),
	"manufacturer" varchar(255),
	"lot_number" varchar(100),
	"expiration_date" timestamp (6) with time zone,
	"administration_date" timestamp (6) with time zone,
	"dose_number" varchar(50),
	"dose_unit" varchar(50),
	"route" varchar(30),
	"site" varchar(100),
	"reaction" varchar(500),
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
	"code" varchar(100),
	"value" varchar(500),
	"unit" varchar(50),
	"interpretation" varchar(50),
	"body_site" varchar(100),
	"method" varchar(100),
	"reference_range" varchar(500),
	"category" varchar(30),
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
	"notes" text,
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
	"frequency" varchar(255),
	"duration" varchar(100),
	"route" varchar(100),
	"notes" varchar(500),
	"created_at" timestamp (6) with time zone,
	"updated_at" timestamp (6) with time zone,
	"prescription_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "procedure_aud" (
	"id" uuid NOT NULL,
	"rev" bigint NOT NULL,
	"revtype" smallint,
	"code" varchar(100),
	"name" varchar(255),
	"category" varchar(30),
	"reason" varchar(1000),
	"outcome" varchar(1000),
	"complications" varchar(1000),
	"status" varchar(20),
	"performed_date" timestamp (6) with time zone,
	"created_at" timestamp (6) with time zone,
	"updated_at" timestamp (6) with time zone,
	"patient_id" uuid,
	"veterinarian_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "immunization" (
	"id" uuid PRIMARY KEY NOT NULL,
	"patient_id" uuid NOT NULL,
	"veterinarian_id" uuid NOT NULL,
	"vaccine_code" varchar(100) NOT NULL,
	"vaccine_name" varchar(255) NOT NULL,
	"manufacturer" varchar(255),
	"lot_number" varchar(100),
	"expiration_date" timestamp with time zone,
	"administration_date" timestamp with time zone NOT NULL,
	"dose_number" varchar(50),
	"dose_unit" varchar(50),
	"route" varchar(30),
	"site" varchar(100),
	"reaction" varchar(500),
	"status" varchar(20) DEFAULT 'COMPLETED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medical_observation" (
	"id" uuid PRIMARY KEY NOT NULL,
	"patient_id" uuid NOT NULL,
	"veterinarian_id" uuid NOT NULL,
	"category" varchar(30) DEFAULT 'GENERAL',
	"code" varchar(100) NOT NULL,
	"value" varchar(500) NOT NULL,
	"unit" varchar(50),
	"interpretation" varchar(50),
	"body_site" varchar(100),
	"method" varchar(100),
	"reference_range" varchar(500),
	"status" varchar(20) DEFAULT 'FINAL' NOT NULL,
	"issued_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prescription_item" (
	"id" uuid PRIMARY KEY NOT NULL,
	"prescription_id" uuid NOT NULL,
	"medication_name" varchar(255) NOT NULL,
	"dosage" varchar(100),
	"frequency" varchar(255),
	"duration" varchar(100),
	"route" varchar(100),
	"notes" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prescription" (
	"id" uuid PRIMARY KEY NOT NULL,
	"patient_id" uuid NOT NULL,
	"veterinarian_id" uuid NOT NULL,
	"issue_date" timestamp with time zone NOT NULL,
	"expiration_date" timestamp with time zone,
	"notes" text,
	"status" varchar(20) DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "procedure" (
	"id" uuid PRIMARY KEY NOT NULL,
	"patient_id" uuid NOT NULL,
	"veterinarian_id" uuid NOT NULL,
	"code" varchar(100),
	"name" varchar(255) NOT NULL,
	"category" varchar(30),
	"reason" varchar(1000),
	"outcome" varchar(1000),
	"complications" varchar(1000),
	"performed_date" timestamp with time zone,
	"status" varchar(20) DEFAULT 'COMPLETED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "billing_item" (
	"id" uuid PRIMARY KEY NOT NULL,
	"billing_id" uuid NOT NULL,
	"description" varchar(255) NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"item_type" varchar(20) NOT NULL,
	"reference_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "billing_item_type_check" CHECK ("billing_item"."item_type" IN ('CONSULTATION', 'PROCEDURE', 'MEDICATION', 'PRODUCT', 'OTHER'))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "billing" (
	"id" uuid PRIMARY KEY NOT NULL,
	"client_id" uuid NOT NULL,
	"appointment_id" uuid,
	"subtotal" numeric(10, 2) NOT NULL,
	"discount" numeric(10, 2) NOT NULL,
	"tax_amount" numeric(10, 2) NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"payment_status" varchar(20) DEFAULT 'PENDING' NOT NULL,
	"invoice_number" varchar(50),
	"notes" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "billing_payment_status_check" CHECK ("billing"."payment_status" IN ('PENDING', 'PARTIAL', 'PAID', 'REFUNDED', 'CANCELLED'))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment" (
	"id" uuid PRIMARY KEY NOT NULL,
	"billing_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_method" varchar(20) NOT NULL,
	"reference" varchar(255),
	"paid_at" timestamp with time zone NOT NULL,
	"notes" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payment_method_check" CHECK ("payment"."payment_method" IN ('CASH', 'CARD', 'TRANSFER', 'YAPE', 'PLIN', 'OTHER'))
);
--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'immunization_aud_rev_revinfo_id_fk') THEN ALTER TABLE "immunization_aud" ADD CONSTRAINT "immunization_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action; END IF; END $$;
--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'medical_observation_aud_rev_revinfo_id_fk') THEN ALTER TABLE "medical_observation_aud" ADD CONSTRAINT "medical_observation_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action; END IF; END $$;
--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'prescription_aud_rev_revinfo_id_fk') THEN ALTER TABLE "prescription_aud" ADD CONSTRAINT "prescription_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action; END IF; END $$;
--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'prescription_item_aud_rev_revinfo_id_fk') THEN ALTER TABLE "prescription_item_aud" ADD CONSTRAINT "prescription_item_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action; END IF; END $$;
--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'procedure_aud_rev_revinfo_id_fk') THEN ALTER TABLE "procedure_aud" ADD CONSTRAINT "procedure_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action; END IF; END $$;
--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'immunization_patient_id_patient_id_fk') THEN ALTER TABLE "immunization" ADD CONSTRAINT "immunization_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE no action ON UPDATE no action; END IF; END $$;
--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'immunization_veterinarian_id_user_id_fk') THEN ALTER TABLE "immunization" ADD CONSTRAINT "immunization_veterinarian_id_user_id_fk" FOREIGN KEY ("veterinarian_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action; END IF; END $$;
--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'medical_observation_patient_id_patient_id_fk') THEN ALTER TABLE "medical_observation" ADD CONSTRAINT "medical_observation_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE no action ON UPDATE no action; END IF; END $$;
--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'medical_observation_veterinarian_id_user_id_fk') THEN ALTER TABLE "medical_observation" ADD CONSTRAINT "medical_observation_veterinarian_id_user_id_fk" FOREIGN KEY ("veterinarian_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action; END IF; END $$;
--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'prescription_item_prescription_id_prescription_id_fk') THEN ALTER TABLE "prescription_item" ADD CONSTRAINT "prescription_item_prescription_id_prescription_id_fk" FOREIGN KEY ("prescription_id") REFERENCES "public"."prescription"("id") ON DELETE cascade ON UPDATE no action; END IF; END $$;
--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'prescription_patient_id_patient_id_fk') THEN ALTER TABLE "prescription" ADD CONSTRAINT "prescription_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE no action ON UPDATE no action; END IF; END $$;
--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'prescription_veterinarian_id_user_id_fk') THEN ALTER TABLE "prescription" ADD CONSTRAINT "prescription_veterinarian_id_user_id_fk" FOREIGN KEY ("veterinarian_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action; END IF; END $$;
--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'procedure_patient_id_patient_id_fk') THEN ALTER TABLE "procedure" ADD CONSTRAINT "procedure_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE no action ON UPDATE no action; END IF; END $$;
--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'procedure_veterinarian_id_user_id_fk') THEN ALTER TABLE "procedure" ADD CONSTRAINT "procedure_veterinarian_id_user_id_fk" FOREIGN KEY ("veterinarian_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action; END IF; END $$;
--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'billing_item_billing_id_billing_id_fk') THEN ALTER TABLE "billing_item" ADD CONSTRAINT "billing_item_billing_id_billing_id_fk" FOREIGN KEY ("billing_id") REFERENCES "public"."billing"("id") ON DELETE no action ON UPDATE no action; END IF; END $$;
--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'billing_client_id_client_id_fk') THEN ALTER TABLE "billing" ADD CONSTRAINT "billing_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE no action ON UPDATE no action; END IF; END $$;
--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payment_billing_id_billing_id_fk') THEN ALTER TABLE "payment" ADD CONSTRAINT "payment_billing_id_billing_id_fk" FOREIGN KEY ("billing_id") REFERENCES "public"."billing"("id") ON DELETE no action ON UPDATE no action; END IF; END $$;
