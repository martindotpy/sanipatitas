import { auth } from "@sanipatitas/auth/auth/configuration/auth-configuration"
import {
  adminEmail,
  adminPassword,
} from "@sanipatitas/auth/core/configuration/app-configuration"
import { db } from "@sanipatitas/database"
import { userTable } from "@sanipatitas/database/auth/schema/auth-schema"
import { seedAppointments } from "@sanipatitas/database/seeds"
import { serverLog } from "@sanipatitas/shared/log/server-logger"

// Test users
const testUsers = [
  {
    name: "Carlos",
    email: "carlos.vet@sanipatitas.com",
    password: adminPassword,
    role: "veterinarian" as const,
    data: { lastName: "Mendoza", emailVerified: true },
  },
  {
    name: "Ana",
    email: "ana.vet@sanipatitas.com",
    password: adminPassword,
    role: "veterinarian" as const,
    data: { lastName: "Torres", emailVerified: true },
  },
  {
    name: "Pedro",
    email: "pedro.worker@sanipatitas.com",
    password: adminPassword,
    role: "worker" as const,
    data: { lastName: "Sánchez", emailVerified: true },
  },
  {
    name: "Lucía",
    email: "lucia.worker@sanipatitas.com",
    password: adminPassword,
    role: "worker" as const,
    data: { lastName: "Díaz", emailVerified: true },
  },
]

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

    // Seed appointments if users exist
    await seedAppointments()

    return
  }

  // Create the admin user
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

  // Create test users (veterinarians and workers)
  for (const testUser of testUsers) {
    try {
      const newUser = await auth.api.createUser({
        body: testUser,
      })

      serverLog.debug("Created test user: %o", newUser)
    } catch (err) {
      serverLog.error({ err }, "Failed to create test user: %s", testUser.email)

      throw err
    }
  }

  // Seed appointments after users are created
  await seedAppointments()
}
