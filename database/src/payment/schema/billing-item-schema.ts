import { billingTable } from "@sanipatitas/database/payment/schema/billing-schema"
import { sql } from "drizzle-orm"
import {
  check,
  decimal,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

// Enums
export const billingItemTypes = [
  "CONSULTATION",
  "PROCEDURE",
  "MEDICATION",
  "PRODUCT",
  "OTHER",
] as const
export type BillingItemType = (typeof billingItemTypes)[number]

// Table
export const billingItemTable = pgTable(
  "billing_item",
  {
    id: uuid()
      .primaryKey()
      .$defaultFn(() => Bun.randomUUIDv7()),
    billingId: uuid()
      .notNull()
      .references(() => billingTable.id),
    description: varchar({ length: 255 }).notNull(),
    quantity: integer().notNull(),
    unitPrice: decimal({ precision: 10, scale: 2 }).notNull(),
    total: decimal({ precision: 10, scale: 2 }).notNull(),
    itemType: varchar({ length: 20, enum: billingItemTypes }).notNull(),
    referenceId: uuid(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check(
      "billing_item_type_check",
      sql`${table.itemType} IN ('CONSULTATION', 'PROCEDURE', 'MEDICATION', 'PRODUCT', 'OTHER')`
    ),
  ]
)
