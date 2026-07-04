import { revinfoTable } from "@sanipatitas/database/audit/schema/revinfo-schema"
import { bigint, pgTable, smallint, uuid, varchar } from "drizzle-orm/pg-core"

export const breedAudTable = pgTable("breed_aud", {
  id: uuid().notNull(),
  rev: bigint({ mode: "number" }).notNull().references(() => revinfoTable.id),
  revtype: smallint(),
  description: varchar({ length: 255 }),
  name: varchar({ length: 255 }),
  speciesId: uuid(),
}, (table) => ({
  pk: { columns: [table.rev, table.id] },
}))
