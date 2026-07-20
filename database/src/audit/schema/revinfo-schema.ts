import { bigint, pgSequence, pgTable, varchar } from "drizzle-orm/pg-core"

export const revinfoSeq = pgSequence("revinfo_seq", {
  startWith: 1,
  increment: 50,
})

export const revinfoTable = pgTable("revinfo", {
  id: bigint({ mode: "number" }).primaryKey(),
  role: varchar({ length: 100 }),
  timestamp: bigint({ mode: "number" }),
  username: varchar({ length: 255 }),
})
