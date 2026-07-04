import { revinfoTable } from "@sanipatitas/database/audit/schema/revinfo-schema"
import { bigint, pgTable, smallint, uuid, varchar } from "drizzle-orm/pg-core"

export const speciesAudTable = pgTable("species_aud", {
  id: uuid().notNull(),
  rev: bigint({ mode: "number" }).notNull().references(() => revinfoTable.id),
  revtype: smallint(),
  description: varchar({ length: 255 }),
  name: varchar({ length: 255 }),
}, (table) => ({
  pk: { columns: [table.rev, table.id] },
}))
