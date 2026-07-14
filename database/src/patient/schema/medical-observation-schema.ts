import { userTable } from "@sanipatitas/database/auth/schema/auth-schema"
import { patientTable } from "@sanipatitas/database/patient/schema/patient-schema"
import {
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

// Enums
export const observationStatuses = ["PRELIMINARY", "FINAL", "AMENDED", "CANCELLED"] as const
export type ObservationStatus = (typeof observationStatuses)[number]

export const observationCategories = ["VITAL_SIGNS", "LABORATORY", "EXAM", "GENERAL"] as const
export type ObservationCategory = (typeof observationCategories)[number]

// Table
export const medicalObservationTable = pgTable("medical_observation", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),
  patientId: uuid()
    .notNull()
    .references(() => patientTable.id),
  veterinarianId: uuid()
    .notNull()
    .references(() => userTable.id),
  category: varchar({ length: 30, enum: observationCategories }).default("GENERAL"),
  code: varchar({ length: 100 }).notNull(),
  value: varchar({ length: 500 }).notNull(),
  unit: varchar({ length: 50 }),
  interpretation: varchar({ length: 50 }),
  bodySite: varchar({ length: 100 }),
  method: varchar({ length: 100 }),
  referenceRange: varchar({ length: 500 }),
  status: varchar({ length: 20, enum: observationStatuses })
    .notNull()
    .default("FINAL"),
  issuedDate: timestamp({ withTimezone: true }),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})
