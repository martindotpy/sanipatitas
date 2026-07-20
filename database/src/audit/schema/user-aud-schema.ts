import { revinfoTable } from "@sanipatitas/database/audit/schema/revinfo-schema"
import {
  bigint,
  boolean,
  pgTable,
  smallint,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const userAudTable = pgTable(
  "user_aud",
  {
    id: uuid().notNull(),
    rev: bigint({ mode: "number" })
      .notNull()
      .references(() => revinfoTable.id),
    revtype: smallint(),
    banExpires: timestamp({ withTimezone: true, mode: "date", precision: 6 }),
    banReason: varchar(),
    banned: boolean(),
    createdAt: timestamp({ withTimezone: true, mode: "date", precision: 6 }),
    email: varchar(),
    emailVerified: boolean(),
    image: varchar(),
    lastName: varchar(),
    name: varchar(),
    role: varchar(),
    updatedAt: timestamp({ withTimezone: true, mode: "date", precision: 6 }),
  },
  (table) => ({
    pk: { columns: [table.rev, table.id] },
  })
)
