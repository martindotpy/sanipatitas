CREATE TABLE "breed" (
	"id" uuid PRIMARY KEY NOT NULL,
	"species_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(2000)
);
--> statement-breakpoint
CREATE TABLE "client" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"id_type" varchar(20) NOT NULL,
	"id_number" varchar(20) NOT NULL,
	"phone" varchar(15) NOT NULL,
	"phone_alt" varchar(15),
	"email" varchar(255),
	"address" varchar(500),
	"notes" varchar(2000),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"search_vector" "tsvector" GENERATED ALWAYS AS (to_tsvector('spanish', coalesce("client"."first_name", '') || ' ' || coalesce("client"."last_name", '') || ' ' || coalesce("client"."id_number", ''))) STORED,
	CONSTRAINT "client_idNumber_unique" UNIQUE("id_number"),
	CONSTRAINT "id_type_check" CHECK ("client"."id_type" IN ('DNI', 'CE', 'PASSPORT'))
);
--> statement-breakpoint
CREATE TABLE "patient" (
	"id" uuid PRIMARY KEY NOT NULL,
	"client_id" uuid NOT NULL,
	"name" varchar(500) NOT NULL,
	"breed_id" uuid,
	"gender" varchar(10),
	"birth_date" date,
	"approximate_age" varchar(50),
	"weight_kg" numeric(5, 2),
	"description" varchar(2000),
	"is_sterilized" boolean,
	"is_deceased" boolean,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"search_vector" "tsvector" GENERATED ALWAYS AS (to_tsvector('spanish', coalesce("patient"."name", '') || ' ' || coalesce("patient"."description", ''))) STORED,
	CONSTRAINT "gender_check" CHECK ("patient"."gender" IN ('MALE', 'FEMALE', 'UNKNOWN'))
);
--> statement-breakpoint
CREATE TABLE "species" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(2000),
	CONSTRAINT "species_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "breed" ADD CONSTRAINT "breed_species_id_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "public"."species"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client" ADD CONSTRAINT "client_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient" ADD CONSTRAINT "patient_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient" ADD CONSTRAINT "patient_breed_id_breed_id_fk" FOREIGN KEY ("breed_id") REFERENCES "public"."breed"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "client_search_idx" ON "client" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "patient_search_idx" ON "patient" USING gin ("search_vector");