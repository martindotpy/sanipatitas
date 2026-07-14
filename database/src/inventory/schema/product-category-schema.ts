import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

// Table
export const productCategoryTable = pgTable("product_category", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),
  name: varchar({ length: 255 }).notNull().unique(),
  description: varchar({ length: 1000 }),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})
