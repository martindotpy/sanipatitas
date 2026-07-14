import { revinfoTable } from "@sanipatitas/database/audit/schema/revinfo-schema"
import { bigint, pgTable, smallint, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

export const medicalConditionAudTable = pgTable(
  "medical_condition_aud",
  {
    id: uuid().notNull(),
    rev: bigint({ mode: "number" })
      .notNull()
      .references(() => revinfoTable.id),
    revtype: smallint(),
    code: varchar({ length: 20 }),
    name: varchar({ length: 255 }),
    description: varchar({ length: 2000 }),
    status: varchar({ length: 20 }),
    severity: varchar({ length: 20 }),
    createdAt: timestamp({ withTimezone: true, mode: "date", precision: 6 }),
    updatedAt: timestamp({ withTimezone: true, mode: "date", precision: 6 }),
    patientId: uuid(),
    veterinarianId: uuid(),
  },
  (table) => ({
    pk: { columns: [table.rev, table.id] },
  })
)
