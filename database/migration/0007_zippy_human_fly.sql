CREATE TABLE "product_category" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(1000),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_category_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(100),
	"description" varchar(2000),
	"price" numeric(10, 2),
	"category_id" uuid,
	"supplier_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_movement" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" varchar(20) NOT NULL,
	"quantity" integer NOT NULL,
	"unit_cost" numeric(10, 2),
	"unit_price" numeric(10, 2),
	"discount" numeric(10, 2),
	"reference" varchar(255),
	"notes" varchar(500),
	"stock_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "movement_type_check" CHECK ("stock_movement"."type" IN ('PURCHASE_ENTRY', 'SALE_EXIT', 'ADJUSTMENT', 'RETURN', 'TRANSFER'))
);
--> statement-breakpoint
CREATE TABLE "stock" (
	"id" uuid PRIMARY KEY NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"location" varchar(255),
	"min_stock" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplier" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"ruc" varchar(20),
	"contact_name" varchar(255),
	"contact_phone" varchar(50),
	"email" varchar(255),
	"address" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_product_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_supplier_id_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."supplier"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_stock_id_stock_id_fk" FOREIGN KEY ("stock_id") REFERENCES "public"."stock"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "stock_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;