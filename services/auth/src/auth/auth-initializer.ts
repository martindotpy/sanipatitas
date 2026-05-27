import { auth } from "@sanipatitas/auth/auth/configuration/auth-configuration"
import {
  adminEmail,
  adminPassword,
} from "@sanipatitas/auth/core/configuration/app-configuration"
import { db } from "@sanipatitas/database"
import { userTable } from "@sanipatitas/database/auth/schema/auth-schema"
import { serverLog } from "@sanipatitas/shared/log/server-logger"

/**
 * Initializes the authentication system.
 */
export async function initializeAuth() {
  serverLog.debug("Initializing authentication...")

  // Generate the default admin user
  // - Verify if the user already exists
  const [userResult] = await db.select().from(userTable).limit(1)

  if (userResult) {
    serverLog.debug("User is already created")

    return
  }

  // Create the user
  try {
    const newUser = await auth.api.createUser({
      body: {
        name: "Martin",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        data: {
          lastName: "Ramos",
          emailVerified: true
        },
      },
    })

    serverLog.debug("Created default admin user: %o", newUser)
  } catch (err) {
    serverLog.error({ err }, "Failed to create the default admin user")

    throw err
  }
}
