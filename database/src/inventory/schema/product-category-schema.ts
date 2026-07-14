import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

// Table
export const productCategoryTable = pgTable("product_category", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),
  name: varchar({ length: 255 }).notNull().unique(),
  description: varchar({ length: 1000 }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})
