import { revinfoTable } from "@sanipatitas/database/audit/schema/revinfo-schema"
import { bigint, date, pgTable, smallint, time, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

export const appointmentAudTable = pgTable("appointment_aud", {
  id: uuid().notNull(),
  rev: bigint({ mode: "number" }).notNull().references(() => revinfoTable.id),
  revtype: smallint(),
  appointmentClass: varchar("class", { length: 20 }),
  createdAt: timestamp({ withTimezone: true, mode: "date", precision: 6 }),
  date: date(),
  endTime: time({ precision: 0 }),
  notes: varchar({ length: 255 }),
  reason: varchar({ length: 255 }),
  startTime: time({ precision: 0 }),
  status: varchar({ length: 20 }),
  updatedAt: timestamp({ withTimezone: true, mode: "date", precision: 6 }),
  clientId: uuid(),
  patientId: uuid(),
  veterinarianId: uuid(),
}, (table) => ({
  pk: { columns: [table.rev, table.id] },
}))
