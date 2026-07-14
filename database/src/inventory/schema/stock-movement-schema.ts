import { sql } from "drizzle-orm"
import { check, decimal, integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { stockTable } from "@sanipatitas/database/inventory/schema/stock-schema"

// Enums
export const movementTypes = [
  "PURCHASE_ENTRY",
  "SALE_EXIT",
  "ADJUSTMENT",
  "RETURN",
  "TRANSFER",
] as const
export type MovementType = (typeof movementTypes)[number]

// Table
export const stockMovementTable = pgTable(
  "stock_movement",
  {
    id: uuid()
      .primaryKey()
      .$defaultFn(() => Bun.randomUUIDv7()),
    type: varchar({ length: 20, enum: movementTypes }).notNull(),
    quantity: integer().notNull(),
    unitCost: decimal({ precision: 10, scale: 2 }),
    unitPrice: decimal({ precision: 10, scale: 2 }),
    discount: decimal({ precision: 10, scale: 2 }),
    reference: varchar({ length: 255 }),
    notes: varchar({ length: 500 }),
    stockId: uuid()
      .notNull()
      .references(() => stockTable.id),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => [
    check(
      "movement_type_check",
      sql`${table.type} IN ('PURCHASE_ENTRY', 'SALE_EXIT', 'ADJUSTMENT', 'RETURN', 'TRANSFER')`
    ),
  ]
)
