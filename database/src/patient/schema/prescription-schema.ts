import { userTable } from "@sanipatitas/database/auth/schema/auth-schema"
import { patientTable } from "@sanipatitas/database/patient/schema/patient-schema"
import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  text,
} from "drizzle-orm/pg-core"

// Enums
export const prescriptionStatuses = ["ACTIVE", "COMPLETED", "CANCELLED"] as const
export type PrescriptionStatus = (typeof prescriptionStatuses)[number]

// Table
export const prescriptionTable = pgTable("prescription", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),
  patientId: uuid()
    .notNull()
    .references(() => patientTable.id),
  veterinarianId: uuid()
    .notNull()
    .references(() => userTable.id),
  issueDate: timestamp({ withTimezone: true }).notNull(),
  expirationDate: timestamp({ withTimezone: true }),
  notes: text(),
  status: varchar({ length: 20, enum: prescriptionStatuses })
    .notNull()
    .default("ACTIVE"),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})
