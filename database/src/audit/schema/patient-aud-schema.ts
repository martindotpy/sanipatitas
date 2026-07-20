import { revinfoTable } from "@sanipatitas/database/audit/schema/revinfo-schema"
import {
  bigint,
  boolean,
  date,
  decimal,
  pgTable,
  smallint,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const patientAudTable = pgTable(
  "patient_aud",
  {
    id: uuid().notNull(),
    rev: bigint({ mode: "number" })
      .notNull()
      .references(() => revinfoTable.id),
    revtype: smallint(),
    approximateAge: varchar({ length: 255 }),
    birthDate: date(),
    createdAt: timestamp({ withTimezone: true, mode: "date", precision: 6 }),
    description: varchar({ length: 255 }),
    gender: varchar({ length: 10 }),
    isDeceased: boolean(),
    isSterilized: boolean(),
    name: varchar({ length: 255 }),
    updatedAt: timestamp({ withTimezone: true, mode: "date", precision: 6 }),
    weightKg: decimal({ precision: 5, scale: 2 }),
    breedId: uuid(),
    clientId: uuid(),
  },
  (table) => ({
    pk: { columns: [table.rev, table.id] },
  })
)
