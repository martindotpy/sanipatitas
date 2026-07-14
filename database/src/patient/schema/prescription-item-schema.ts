import { prescriptionTable } from "@sanipatitas/database/patient/schema/prescription-schema"
import {
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

// Table
export const prescriptionItemTable = pgTable("prescription_item", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),
  prescriptionId: uuid()
    .notNull()
    .references(() => prescriptionTable.id, { onDelete: "cascade" }),
  medicationName: varchar({ length: 255 }).notNull(),
  dosage: varchar({ length: 100 }),
  frequency: varchar({ length: 255 }),
  duration: varchar({ length: 100 }),
  route: varchar({ length: 100 }),
  notes: varchar({ length: 500 }),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})
