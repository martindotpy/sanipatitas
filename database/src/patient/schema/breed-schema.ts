import { tsvector } from "@sanipatitas/database/core/custom-types"
import { speciesTable } from "@sanipatitas/database/patient/schema/species-schema"
import { sql, type SQL } from "drizzle-orm"
import { index, pgTable, uuid, varchar } from "drizzle-orm/pg-core"

// Table
export const breedTable = pgTable(
  "breed",
  {
    id: uuid()
      .primaryKey()
      .$defaultFn(() => Bun.randomUUIDv7()),
    speciesId: uuid()
      .notNull()
      .references(() => speciesTable.id),
    name: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 2000 }),
    searchVector: tsvector("search_vector").generatedAlwaysAs(
      (): SQL =>
        sql`to_tsvector('spanish', coalesce(${breedTable.name}, '') || ' ' || coalesce(${breedTable.description}, ''))`
    ),
  },
  (table) => [index("breed_search_idx").using("gin", table.searchVector)]
)
