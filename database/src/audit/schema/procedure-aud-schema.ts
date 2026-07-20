import { revinfoTable } from "@sanipatitas/database/audit/schema/revinfo-schema"
import {
  bigint,
  pgTable,
  smallint,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const procedureAudTable = pgTable(
  "procedure_aud",
  {
    id: uuid().notNull(),
    rev: bigint({ mode: "number" })
      .notNull()
      .references(() => revinfoTable.id),
    revtype: smallint(),
    code: varchar({ length: 100 }),
    name: varchar({ length: 255 }),
    category: varchar({ length: 30 }),
    reason: varchar({ length: 1000 }),
    outcome: varchar({ length: 1000 }),
    complications: varchar({ length: 1000 }),
    status: varchar({ length: 20 }),
    performedDate: timestamp({
      withTimezone: true,
      mode: "date",
      precision: 6,
    }),
    createdAt: timestamp({ withTimezone: true, mode: "date", precision: 6 }),
    updatedAt: timestamp({ withTimezone: true, mode: "date", precision: 6 }),
    patientId: uuid(),
    veterinarianId: uuid(),
  },
  (table) => ({
    pk: { columns: [table.rev, table.id] },
  })
)
