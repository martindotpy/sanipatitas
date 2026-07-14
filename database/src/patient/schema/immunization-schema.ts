import { userTable } from "@sanipatitas/database/auth/schema/auth-schema"
import { patientTable } from "@sanipatitas/database/patient/schema/patient-schema"
import {
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

// Enums
export const immunizationStatuses = ["COMPLETED", "ENTERED_IN_ERROR", "NOT_DONE"] as const
export type ImmunizationStatus = (typeof immunizationStatuses)[number]

export const immunizationRoutes = ["SUBCUTANEOUS", "INTRAMUSCULAR", "ORAL", "INTRADERMAL", "TOPICAL"] as const
export type ImmunizationRoute = (typeof immunizationRoutes)[number]

// Table
export const immunizationTable = pgTable("immunization", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),
  patientId: uuid()
    .notNull()
    .references(() => patientTable.id),
  veterinarianId: uuid()
    .notNull()
    .references(() => userTable.id),
  vaccineCode: varchar({ length: 100 }).notNull(),
  vaccineName: varchar({ length: 255 }).notNull(),
  manufacturer: varchar({ length: 255 }),
  lotNumber: varchar({ length: 100 }),
  expirationDate: timestamp({ withTimezone: true }),
  administrationDate: timestamp({ withTimezone: true }).notNull(),
  doseNumber: varchar({ length: 50 }),
  doseUnit: varchar({ length: 50 }),
  route: varchar({ length: 30, enum: immunizationRoutes }),
  site: varchar({ length: 100 }),
  reaction: varchar({ length: 500 }),
  status: varchar({ length: 20, enum: immunizationStatuses })
    .notNull()
    .default("COMPLETED"),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})
