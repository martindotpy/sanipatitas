import { integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { productTable } from "@sanipatitas/database/inventory/schema/product-schema"

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
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})
