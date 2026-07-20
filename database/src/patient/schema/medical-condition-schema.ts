import { userTable } from "@sanipatitas/database/auth/schema/auth-schema"
import { patientTable } from "@sanipatitas/database/patient/schema/patient-schema"
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

// Enums
export const conditionStatuses = ["ACTIVE", "RESOLVED", "RELAPSE"] as const
export type ConditionStatus = (typeof conditionStatuses)[number]

export const conditionSeverities = ["MILD", "MODERATE", "SEVERE"] as const
export type ConditionSeverity = (typeof conditionSeverities)[number]

// Table
export const medicalConditionTable = pgTable("medical_condition", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),
  patientId: uuid()
    .notNull()
    .references(() => patientTable.id),
  veterinarianId: uuid()
    .notNull()
    .references(() => userTable.id),
  code: varchar({ length: 20 }),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 2000 }),
  onsetDate: timestamp({ withTimezone: true }),
  status: varchar({ length: 20, enum: conditionStatuses })
    .notNull()
    .default("ACTIVE"),
  severity: varchar({ length: 20, enum: conditionSeverities }),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})
