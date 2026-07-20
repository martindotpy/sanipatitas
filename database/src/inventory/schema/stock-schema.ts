import { productTable } from "@sanipatitas/database/inventory/schema/product-schema"
import { integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

// Table
export const stockTable = pgTable("stock", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),
  productId: uuid()
    .notNull()
    .references(() => productTable.id),
  quantity: integer().notNull().default(0),
  location: varchar({ length: 255 }),
  minStock: integer(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})
