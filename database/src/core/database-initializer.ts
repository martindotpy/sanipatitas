import { db } from "@sanipatitas/database"
import {
  seedBilling,
  seedDatabase,
  seedInventory,
} from "@sanipatitas/database/seeds"
import { serverLog } from "@sanipatitas/shared/log/server-logger"
import { migrate } from "drizzle-orm/bun-sql/migrator"

// Initializer
export async function initializeDatabase(migrationsFolder: string) {
  if (process.env.MIGRATE === "false") {
    serverLog.info("Skipping database migrations")

    return
  }

  // Run migration
  serverLog.info("Running database migrations...")

  await migrate(db, { migrationsFolder }).catch((error) => {
    serverLog.error({ err: error }, "Database migration failed:")

    throw error
  })

  serverLog.info("Database migrations completed")

  // Seed test data
  await seedDatabase()
  await seedInventory()
  await seedBilling()
}
