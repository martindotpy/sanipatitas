CREATE TABLE "appointment" (
	"id" uuid PRIMARY KEY NOT NULL,
	"patient_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"veterinarian_id" uuid NOT NULL,
	"date" date NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time,
	"status" varchar(20) NOT NULL,
	"class" varchar(20) DEFAULT 'AMBULATORY' NOT NULL,
	"reason" varchar(2000),
	"notes" varchar(2000),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "appointment_status_check" CHECK ("appointment"."status" IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
	CONSTRAINT "appointment_class_check" CHECK ("appointment"."class" IN ('AMBULATORY', 'EMERGENCY', 'HOME_VISIT'))
);
--> statement-breakpoint
ALTER TABLE "breed" ADD COLUMN "search_vector" "tsvector" GENERATED ALWAYS AS (to_tsvector('spanish', coalesce("breed"."name", '') || ' ' || coalesce("breed"."description", ''))) STORED;--> statement-breakpoint
ALTER TABLE "species" ADD COLUMN "search_vector" "tsvector" GENERATED ALWAYS AS (to_tsvector('spanish', coalesce("species"."name", '') || ' ' || coalesce("species"."description", ''))) STORED;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_veterinarian_id_user_id_fk" FOREIGN KEY ("veterinarian_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "breed_search_idx" ON "breed" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "species_search_idx" ON "species" USING gin ("search_vector");