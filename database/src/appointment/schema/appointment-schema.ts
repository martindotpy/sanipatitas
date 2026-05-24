import { userTable } from "@sanipatitas/database/auth/schema/auth-schema"
import { clientTable } from "@sanipatitas/database/patient/schema/client-schema"
import { patientTable } from "@sanipatitas/database/patient/schema/patient-schema"
import { sql } from "drizzle-orm"
import {
  check,
  date,
  pgTable,
  time,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

// Enum
export const appointmentStatuses = [
  "SCHEDULED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
] as const
export type AppointmentStatus = (typeof appointmentStatuses)[number]

export const appointmentClasses = [
  "AMBULATORY",
  "EMERGENCY",
  "HOME_VISIT",
] as const
export type AppointmentClass = (typeof appointmentClasses)[number]

// Table
export const appointmentTable = pgTable(
  "appointment",
  {
    id: uuid()
      .primaryKey()
      .$defaultFn(() => Bun.randomUUIDv7()),
    patientId: uuid()
      .notNull()
      .references(() => patientTable.id),
    clientId: uuid()
      .notNull()
      .references(() => clientTable.id),
    veterinarianId: uuid()
      .notNull()
      .references(() => userTable.id),
    date: date().notNull(),
    startTime: time().notNull(),
    endTime: time(),
    status: varchar({ length: 20, enum: appointmentStatuses }).notNull(),
    appointmentClass: varchar("class", { length: 20, enum: appointmentClasses })
      .notNull()
      .default("AMBULATORY"),
    reason: varchar({ length: 2000 }),
    notes: varchar({ length: 2000 }),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    check(
      "appointment_status_check",
      sql`${table.status} IN (${appointmentStatuses.map((status) => `'${status}'`).join(", ")})`
    ),
    check(
      "appointment_class_check",
      sql`${table.appointmentClass} IN (${appointmentClasses.map((cls) => `'${cls}'`).join(", ")})`
    ),
  ]
)
