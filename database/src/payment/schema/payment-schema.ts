import { sql } from "drizzle-orm"
import {
  check,
  decimal,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { billingTable } from "@sanipatitas/database/payment/schema/billing-schema"

// Enums
export const paymentMethods = [
  "CASH",
  "CARD",
  "TRANSFER",
  "YAPE",
  "PLIN",
  "OTHER",
] as const
export type PaymentMethod = (typeof paymentMethods)[number]

// Table
export const paymentTable = pgTable(
  "payment",
  {
    id: uuid()
      .primaryKey()
      .$defaultFn(() => Bun.randomUUIDv7()),
    billingId: uuid()
      .notNull()
      .references(() => billingTable.id),
    amount: decimal({ precision: 10, scale: 2 }).notNull(),
    paymentMethod: varchar({ length: 20, enum: paymentMethods }).notNull(),
    reference: varchar({ length: 255 }),
    paidAt: timestamp({ withTimezone: true }).notNull(),
    notes: varchar({ length: 500 }),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check(
      "payment_method_check",
      sql`${table.paymentMethod} IN ('CASH', 'CARD', 'TRANSFER', 'YAPE', 'PLIN', 'OTHER')`
    ),
  ]
)
