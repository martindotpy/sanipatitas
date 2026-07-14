import { decimal, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { productCategoryTable } from "@sanipatitas/database/inventory/schema/product-category-schema"
import { supplierTable } from "@sanipatitas/database/inventory/schema/supplier-schema"

// Table
export const productTable = pgTable("product", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),
  name: varchar({ length: 255 }).notNull(),
  code: varchar({ length: 100 }),
  description: varchar({ length: 2000 }),
  price: decimal({ precision: 10, scale: 2 }),
  categoryId: uuid().references(() => productCategoryTable.id),
  supplierId: uuid().references(() => supplierTable.id),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})
