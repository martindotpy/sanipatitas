import { pgTable, uuid, varchar } from "drizzle-orm/pg-core"

// Table
export const speciesTable = pgTable("species", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),
  name: varchar({ length: 255 }).notNull().unique(),
  description: varchar({ length: 2000 }),
})
