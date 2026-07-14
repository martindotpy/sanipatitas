import { revinfoTable } from "@sanipatitas/database/audit/schema/revinfo-schema"
import { bigint, pgTable, smallint, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

export const immunizationAudTable = pgTable(
  "immunization_aud",
  {
    id: uuid().notNull(),
    rev: bigint({ mode: "number" })
      .notNull()
      .references(() => revinfoTable.id),
    revtype: smallint(),
    vaccineCode: varchar({ length: 100 }),
    vaccineName: varchar({ length: 255 }),
    manufacturer: varchar({ length: 255 }),
    lotNumber: varchar({ length: 100 }),
    expirationDate: timestamp({ withTimezone: true, mode: "date", precision: 6 }),
    administrationDate: timestamp({ withTimezone: true, mode: "date", precision: 6 }),
    doseNumber: varchar({ length: 50 }),
    doseUnit: varchar({ length: 50 }),
    route: varchar({ length: 30 }),
    site: varchar({ length: 100 }),
    reaction: varchar({ length: 500 }),
    status: varchar({ length: 20 }),
    createdAt: timestamp({ withTimezone: true, mode: "date", precision: 6 }),
    updatedAt: timestamp({ withTimezone: true, mode: "date", precision: 6 }),
    patientId: uuid(),
    veterinarianId: uuid(),
  },
  (table) => ({
    pk: { columns: [table.rev, table.id] },
  })
)
