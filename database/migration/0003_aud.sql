CREATE SEQUENCE "public"."revinfo_seq" INCREMENT BY 50 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE TABLE "appointment_aud" (
	"id" uuid NOT NULL,
	"rev" bigint NOT NULL,
	"revtype" smallint,
	"class" varchar(20),
	"created_at" timestamp (6) with time zone,
	"date" date,
	"end_time" time(0),
	"notes" varchar(255),
	"reason" varchar(255),
	"start_time" time(0),
	"status" varchar(20),
	"updated_at" timestamp (6) with time zone,
	"client_id" uuid,
	"patient_id" uuid,
	"veterinarian_id" uuid
);
--> statement-breakpoint
CREATE TABLE "breed_aud" (
	"id" uuid NOT NULL,
	"rev" bigint NOT NULL,
	"revtype" smallint,
	"description" varchar(255),
	"name" varchar(255),
	"species_id" uuid
);
--> statement-breakpoint
CREATE TABLE "client_aud" (
	"id" uuid NOT NULL,
	"rev" bigint NOT NULL,
	"revtype" smallint,
	"address" varchar(255),
	"created_at" timestamp (6) with time zone,
	"email" varchar(255),
	"first_name" varchar(255),
	"id_number" varchar(255),
	"id_type" varchar(20),
	"is_active" boolean,
	"last_name" varchar(255),
	"notes" varchar(255),
	"phone" varchar(15),
	"phone_alt" varchar(15),
	"updated_at" timestamp (6) with time zone
);
--> statement-breakpoint
CREATE TABLE "patient_aud" (
	"id" uuid NOT NULL,
	"rev" bigint NOT NULL,
	"revtype" smallint,
	"approximate_age" varchar(255),
	"birth_date" date,
	"created_at" timestamp (6) with time zone,
	"description" varchar(255),
	"gender" varchar(10),
	"is_deceased" boolean,
	"is_sterilized" boolean,
	"name" varchar(255),
	"updated_at" timestamp (6) with time zone,
	"weight_kg" numeric(5, 2),
	"breed_id" uuid,
	"client_id" uuid
);
--> statement-breakpoint
CREATE TABLE "revinfo" (
	"id" bigint PRIMARY KEY NOT NULL,
	"role" varchar(100),
	"timestamp" bigint,
	"username" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "species_aud" (
	"id" uuid NOT NULL,
	"rev" bigint NOT NULL,
	"revtype" smallint,
	"description" varchar(255),
	"name" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "user_aud" (
	"id" uuid NOT NULL,
	"rev" bigint NOT NULL,
	"revtype" smallint,
	"ban_expires" timestamp (6) with time zone,
	"ban_reason" varchar,
	"banned" boolean,
	"created_at" timestamp (6) with time zone,
	"email" varchar,
	"email_verified" boolean,
	"image" varchar,
	"last_name" varchar,
	"name" varchar,
	"role" varchar,
	"updated_at" timestamp (6) with time zone
);
--> statement-breakpoint
ALTER TABLE "appointment_aud" ADD CONSTRAINT "appointment_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "breed_aud" ADD CONSTRAINT "breed_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_aud" ADD CONSTRAINT "client_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_aud" ADD CONSTRAINT "patient_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "species_aud" ADD CONSTRAINT "species_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_aud" ADD CONSTRAINT "user_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action;