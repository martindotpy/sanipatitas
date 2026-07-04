import { revinfoTable } from "@sanipatitas/database/audit/schema/revinfo-schema"
import { bigint, boolean, pgTable, smallint, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

export const clientAudTable = pgTable("client_aud", {
  id: uuid().notNull(),
  rev: bigint({ mode: "number" }).notNull().references(() => revinfoTable.id),
  revtype: smallint(),
  address: varchar({ length: 255 }),
  createdAt: timestamp({ withTimezone: true, mode: "date", precision: 6 }),
  email: varchar({ length: 255 }),
  firstName: varchar({ length: 255 }),
  idNumber: varchar({ length: 255 }),
  idType: varchar({ length: 20 }),
  isActive: boolean(),
  lastName: varchar({ length: 255 }),
  notes: varchar({ length: 255 }),
  phone: varchar({ length: 15 }),
  phoneAlt: varchar({ length: 15 }),
  updatedAt: timestamp({ withTimezone: true, mode: "date", precision: 6 }),
}, (table) => ({
  pk: { columns: [table.rev, table.id] },
}))
