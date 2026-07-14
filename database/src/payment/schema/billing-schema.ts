import { clientTable } from "@sanipatitas/database/patient/schema/client-schema"
import { sql } from "drizzle-orm"
import {
  check,
  decimal,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

// Enums
export const paymentStatuses = [
  "PENDING",
  "PARTIAL",
  "PAID",
  "REFUNDED",
  "CANCELLED",
] as const
export type PaymentStatus = (typeof paymentStatuses)[number]

// Table
export const billingTable = pgTable(
  "billing",
  {
    id: uuid()
      .primaryKey()
      .$defaultFn(() => Bun.randomUUIDv7()),
    clientId: uuid()
      .notNull()
      .references(() => clientTable.id),
    appointmentId: uuid(),
    subtotal: decimal({ precision: 10, scale: 2 }).notNull(),
    discount: decimal({ precision: 10, scale: 2 }).notNull(),
    taxAmount: decimal({ precision: 10, scale: 2 }).notNull(),
    totalAmount: decimal({ precision: 10, scale: 2 }).notNull(),
    paymentStatus: varchar({ length: 20, enum: paymentStatuses })
      .notNull()
      .default("PENDING"),
    invoiceNumber: varchar({ length: 50 }),
    notes: varchar({ length: 500 }),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    check(
      "billing_payment_status_check",
      sql`${table.paymentStatus} IN ('PENDING', 'PARTIAL', 'PAID', 'REFUNDED', 'CANCELLED')`
    ),
  ]
)
