import { tsvector } from "@sanipatitas/database/core/custom-types"
import { sql, type SQL } from "drizzle-orm"
import { index, pgTable, uuid, varchar } from "drizzle-orm/pg-core"

// Table
export const speciesTable = pgTable(
  "species",
  {
    id: uuid()
      .primaryKey()
      .$defaultFn(() => Bun.randomUUIDv7()),
    name: varchar({ length: 255 }).notNull().unique(),
    description: varchar({ length: 2000 }),
    searchVector: tsvector("search_vector").generatedAlwaysAs(
      (): SQL =>
        sql`to_tsvector('spanish', coalesce(${speciesTable.name}, '') || ' ' || coalesce(${speciesTable.description}, ''))`
    ),
  },
  (table) => [index("species_search_idx").using("gin", table.searchVector)]
)
