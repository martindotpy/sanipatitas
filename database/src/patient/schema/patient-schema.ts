import { tsvector } from "@sanipatitas/database/core/custom-types"
import { breedTable } from "@sanipatitas/database/patient/schema/breed-schema"
import { clientTable } from "@sanipatitas/database/patient/schema/client-schema"
import { sql, type SQL } from "drizzle-orm"
import {
  boolean,
  check,
  date,
  decimal,
  index,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

// Enum
export const genders = ["MALE", "FEMALE", "UNKNOWN"] as const
export type Gender = (typeof genders)[number]

// Table
export const patientTable = pgTable(
  "patient",
  {
    id: uuid()
      .primaryKey()
      .$defaultFn(() => Bun.randomUUIDv7()),
    clientId: uuid()
      .notNull()
      .references(() => clientTable.id),
    name: varchar({ length: 500 }).notNull(),
    breedId: uuid().references(() => breedTable.id),
    gender: varchar({ length: 10, enum: genders }),
    birthDate: date(),
    approximateAge: varchar({ length: 50 }),
    weightKg: decimal({ precision: 5, scale: 2 }),
    description: varchar({ length: 2000 }),
    isSterilized: boolean(),
    isDeceased: boolean(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    searchVector: tsvector("search_vector").generatedAlwaysAs(
      (): SQL =>
        sql`to_tsvector('spanish', coalesce(${patientTable.name}, '') || ' ' || coalesce(${patientTable.description}, ''))`
    ),
  },
  (table) => [
    check(
      "gender_check",
      sql`${table.gender} IN ('MALE', 'FEMALE', 'UNKNOWN')`
    ),
    index("patient_search_idx").using("gin", table.searchVector),
  ]
)
