CREATE TABLE "medical_condition_aud" (
	"id" uuid NOT NULL,
	"rev" bigint NOT NULL,
	"revtype" smallint,
	"code" varchar(20),
	"name" varchar(255),
	"description" varchar(2000),
	"status" varchar(20),
	"severity" varchar(20),
	"created_at" timestamp (6) with time zone,
	"updated_at" timestamp (6) with time zone,
	"patient_id" uuid,
	"veterinarian_id" uuid
);
--> statement-breakpoint
CREATE TABLE "medical_condition" (
	"id" uuid PRIMARY KEY NOT NULL,
	"patient_id" uuid NOT NULL,
	"veterinarian_id" uuid NOT NULL,
	"code" varchar(20),
	"name" varchar(255) NOT NULL,
	"description" varchar(2000),
	"onset_date" timestamp with time zone,
	"status" varchar(20) DEFAULT 'ACTIVE' NOT NULL,
	"severity" varchar(20),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "medical_condition_aud" ADD CONSTRAINT "medical_condition_aud_rev_revinfo_id_fk" FOREIGN KEY ("rev") REFERENCES "public"."revinfo"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_condition" ADD CONSTRAINT "medical_condition_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_condition" ADD CONSTRAINT "medical_condition_veterinarian_id_user_id_fk" FOREIGN KEY ("veterinarian_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;