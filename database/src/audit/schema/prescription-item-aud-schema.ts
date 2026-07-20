import { revinfoTable } from "@sanipatitas/database/audit/schema/revinfo-schema"
import {
  bigint,
  pgTable,
  smallint,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const prescriptionItemAudTable = pgTable(
  "prescription_item_aud",
  {
    id: uuid().notNull(),
    rev: bigint({ mode: "number" })
      .notNull()
      .references(() => revinfoTable.id),
    revtype: smallint(),
    medicationName: varchar({ length: 255 }),
    dosage: varchar({ length: 100 }),
    frequency: varchar({ length: 255 }),
    duration: varchar({ length: 100 }),
    route: varchar({ length: 100 }),
    notes: varchar({ length: 500 }),
    createdAt: timestamp({ withTimezone: true, mode: "date", precision: 6 }),
    updatedAt: timestamp({ withTimezone: true, mode: "date", precision: 6 }),
    prescriptionId: uuid(),
  },
  (table) => ({
    pk: { columns: [table.rev, table.id] },
  })
)
