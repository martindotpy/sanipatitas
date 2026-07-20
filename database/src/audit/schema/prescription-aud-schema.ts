import { revinfoTable } from "@sanipatitas/database/audit/schema/revinfo-schema"
import {
  bigint,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const prescriptionAudTable = pgTable(
  "prescription_aud",
  {
    id: uuid().notNull(),
    rev: bigint({ mode: "number" })
      .notNull()
      .references(() => revinfoTable.id),
    revtype: smallint(),
    issueDate: timestamp({ withTimezone: true, mode: "date", precision: 6 }),
    expirationDate: timestamp({
      withTimezone: true,
      mode: "date",
      precision: 6,
    }),
    notes: text(),
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
