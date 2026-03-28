import { auth } from "@sanipatitas/auth/auth/configuration/auth-configuration"
import {
  adminEmail,
  adminPassword,
} from "@sanipatitas/auth/core/configuration/app-configuration"
import { db } from "@sanipatitas/database"
import { userTable } from "@sanipatitas/database/auth/schema/auth-schema"

/**
 * Initializes the authentication system.
 */
export async function initializeAuth() {
  console.log("Initializing authentication...")

  // Generate the default admin user
  // - Verify if the user already exists
  const [userResult] = await db.select().from(userTable).limit(1)

  if (userResult) {
    console.log("User is already created")

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
        },
      },
    })

    console.log("Created default admin user:", newUser)
  } catch (error) {
    console.error("Failed to create the default admin user:\n", error)

    throw error
  }
}
