import { revinfoTable } from "@sanipatitas/database/audit/schema/revinfo-schema"
import { bigint, pgTable, smallint, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

export const medicalObservationAudTable = pgTable(
  "medical_observation_aud",
  {
    id: uuid().notNull(),
    rev: bigint({ mode: "number" })
      .notNull()
      .references(() => revinfoTable.id),
    revtype: smallint(),
    code: varchar({ length: 100 }),
    value: varchar({ length: 500 }),
    unit: varchar({ length: 50 }),
    interpretation: varchar({ length: 50 }),
    bodySite: varchar({ length: 100 }),
    method: varchar({ length: 100 }),
    referenceRange: varchar({ length: 500 }),
    category: varchar({ length: 30 }),
    status: varchar({ length: 20 }),
    issuedDate: timestamp({ withTimezone: true, mode: "date", precision: 6 }),
    createdAt: timestamp({ withTimezone: true, mode: "date", precision: 6 }),
    updatedAt: timestamp({ withTimezone: true, mode: "date", precision: 6 }),
    patientId: uuid(),
    veterinarianId: uuid(),
  },
  (table) => ({
    pk: { columns: [table.rev, table.id] },
  })
)
