import { pgTable, uuid, varchar } from "drizzle-orm/pg-core"

import { speciesTable } from "@sanipatitas/database/patient/schema/species-schema"

// Table
export const breedTable = pgTable("breed", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),
  speciesId: uuid()
    .notNull()
    .references(() => speciesTable.id),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 2000 }),
})
