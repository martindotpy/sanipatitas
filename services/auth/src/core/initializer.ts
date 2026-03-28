import { initializeAuth } from "@sanipatitas/auth/auth/auth-initializer"
import { initializeDatabase } from "@sanipatitas/database/core/database-initializer"
import path from "node:path"

// Migration path
const cwd = process.cwd()
const migrationsFolder = path.join(cwd, "..", "..", "database", "migration")

/**
 * Initializes the application.
 */
export async function initializeApp() {
  await initializeDatabase(migrationsFolder)

  await initializeAuth()
}
