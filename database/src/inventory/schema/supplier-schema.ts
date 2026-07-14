import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

// Table
export const supplierTable = pgTable("supplier", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),
  name: varchar({ length: 255 }).notNull(),
  ruc: varchar({ length: 20 }),
  contactName: varchar({ length: 255 }),
  contactPhone: varchar({ length: 50 }),
  email: varchar({ length: 255 }),
  address: varchar({ length: 500 }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})
