import { customType } from "drizzle-orm/pg-core"

// Postgres type
export const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector"
  },
})
