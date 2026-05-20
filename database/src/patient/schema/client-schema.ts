import { sql, type SQL } from "drizzle-orm"
import {
  boolean,
  check,
  index,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

import { userTable } from "@sanipatitas/database/auth/schema/auth-schema"
import { tsvector } from "@sanipatitas/database/core/custom-types"

// Enum
const idTypes = ["DNI", "CE", "PASSPORT"] as const
export type IdType = (typeof idTypes)[number]

// Table
export const clientTable = pgTable(
  "client",
  {
    id: uuid()
      .primaryKey()
      .$defaultFn(() => Bun.randomUUIDv7()),
    userId: uuid().references(() => userTable.id),
    firstName: varchar({ length: 100 }).notNull(),
    lastName: varchar({ length: 100 }).notNull(),
    idType: varchar({ length: 20, enum: idTypes }).notNull(),
    idNumber: varchar({ length: 20 }).notNull().unique(),
    phone: varchar({ length: 15 }).notNull(),
    phoneAlt: varchar({ length: 15 }),
    email: varchar({ length: 255 }),
    address: varchar({ length: 500 }),
    notes: varchar({ length: 2000 }),
    isActive: boolean().default(true).notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    searchVector: tsvector("search_vector").generatedAlwaysAs(
      (): SQL => sql`to_tsvector('spanish', coalesce(${clientTable.firstName}, '') || ' ' || coalesce(${clientTable.lastName}, '') || ' ' || coalesce(${clientTable.idNumber}, ''))`
    ),
  },
  (table) => [
    check("id_type_check", sql`${table.idType} IN ('DNI', 'CE', 'PASSPORT')`),
    index("client_search_idx").using("gin", table.searchVector),
  ]
)
