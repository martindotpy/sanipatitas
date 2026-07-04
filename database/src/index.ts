import * as appointmentSchema from "@sanipatitas/database/appointment/schema/appointment-schema"
import * as appointmentAudSchema from "@sanipatitas/database/audit/schema/appointment-aud-schema"
import * as authSchema from "@sanipatitas/database/auth/schema/auth-schema"
import * as breedAudSchema from "@sanipatitas/database/audit/schema/breed-aud-schema"
import * as breedSchema from "@sanipatitas/database/patient/schema/breed-schema"
import * as clientAudSchema from "@sanipatitas/database/audit/schema/client-aud-schema"
import * as clientSchema from "@sanipatitas/database/patient/schema/client-schema"
import * as patientAudSchema from "@sanipatitas/database/audit/schema/patient-aud-schema"
import * as patientSchema from "@sanipatitas/database/patient/schema/patient-schema"
import * as revinfoSchema from "@sanipatitas/database/audit/schema/revinfo-schema"
import * as speciesAudSchema from "@sanipatitas/database/audit/schema/species-aud-schema"
import * as speciesSchema from "@sanipatitas/database/patient/schema/species-schema"
import * as userAudSchema from "@sanipatitas/database/audit/schema/user-aud-schema"
import { serverLog } from "@sanipatitas/shared/log/server-logger"
import { SQL } from "bun"
import { drizzle } from "drizzle-orm/bun-sql"

// Database client
const client = new SQL()

// All schemas
const allSchemas = {
  ...appointmentSchema,
  ...appointmentAudSchema,
  ...authSchema,
  ...breedAudSchema,
  ...breedSchema,
  ...clientAudSchema,
  ...clientSchema,
  ...patientAudSchema,
  ...patientSchema,
  ...revinfoSchema,
  ...speciesAudSchema,
  ...speciesSchema,
  ...userAudSchema,
}

// Schema
type Schemas = typeof allSchemas
type StripTableSuffix<S extends string> = S extends `${infer R}Table` ? R : S

type DatabaseSchema = {
  [K in keyof Schemas as StripTableSuffix<K>]: Schemas[K]
}

// Helper to strip "Table" suffix at runtime
const stripTableSuffix = (schemas: Record<string, unknown>) => {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(schemas)) {
    const newKey = key.endsWith("Table") ? key.slice(0, -5) : key
    result[newKey] = value
  }
  return result
}

export const schema = stripTableSuffix(allSchemas) as DatabaseSchema

// Database
export const db = drizzle({
  client,
  schema,
  logger: {
    logQuery(query, params) {
      serverLog.debug({ query, params })
    },
  },
  casing: "snake_case",
})
