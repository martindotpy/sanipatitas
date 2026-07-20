import { userTable } from "@sanipatitas/database/auth/schema/auth-schema"
import { patientTable } from "@sanipatitas/database/patient/schema/patient-schema"
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

// Enums
export const procedureStatuses = [
  "PREPARATION",
  "IN_PROGRESS",
  "COMPLETED",
  "ABANDONED",
] as const
export type ProcedureStatus = (typeof procedureStatuses)[number]

export const procedureCategories = [
  "SURGICAL",
  "DIAGNOSTIC",
  "THERAPEUTIC",
  "PREVENTIVE",
  "OTHER",
] as const
export type ProcedureCategory = (typeof procedureCategories)[number]

// Table
export const procedureTable = pgTable("procedure", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),
  patientId: uuid()
    .notNull()
    .references(() => patientTable.id),
  veterinarianId: uuid()
    .notNull()
    .references(() => userTable.id),
  code: varchar({ length: 100 }),
  name: varchar({ length: 255 }).notNull(),
  category: varchar({ length: 30, enum: procedureCategories }),
  reason: varchar({ length: 1000 }),
  outcome: varchar({ length: 1000 }),
  complications: varchar({ length: 1000 }),
  performedDate: timestamp({ withTimezone: true }),
  status: varchar({ length: 20, enum: procedureStatuses })
    .notNull()
    .default("COMPLETED"),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})
