import {
  ac,
  admin as adminRole,
  veterinarian,
  worker,
} from "@sanipatitas/auth/auth/configuration/permissions"
import { buildVerificationEmailHtml } from "@sanipatitas/auth/auth/mail/verification-email"
import { isDev } from "@sanipatitas/auth/core/configuration/app-configuration"
import { sendMail } from "@sanipatitas/auth/core/mailer/mailer"
import { db, schema } from "@sanipatitas/database"
import { serverLog } from "@sanipatitas/shared/log/server-logger"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin, jwt, openAPI } from "better-auth/plugins"
import { redis } from "bun"

// Logger
const authLogger = serverLog.child({ module: "auth" })

// Redis
const namespace = "sanipatitas:auth"

// Configuration
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema, debugLogs: true }),
  logger: {
    log(level, message, ...args) {
      authLogger[level](message, ...args)
    },
    ...(isDev ? { level: "debug" } : {}),
  },
  emailAndPassword: {
    enabled: true,
    maxPasswordLength: 60,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendMail({
        to: user.email,
        subject: "Verifica tu correo - Sanipatitas",
        html: buildVerificationEmailHtml({ name: user.name, url }),
      })
    },
    // Sending centralized in databaseHooks below, avoids double-send on sign-up
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
    expiresIn: 3600,
  },
  user: {
    additionalFields: {
      lastName: {
        type: "string",
        required: true,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (user.emailVerified) {
            return
          }

          await auth.api.sendVerificationEmail({
            body: { email: user.email, callbackURL: "/sign-in?verified=true" },
          })
        },
      },
    },
  },
  plugins: [
    admin({
      ac,
      roles: {
        admin: adminRole,
        veterinarian,
        worker,
      },
      adminRoles: ["admin"],
    }),
    jwt({
      jwks: {
        keyPairConfig: {
          alg: "ES256",
        },
      },
    }),
    openAPI({ disableDefaultReference: true }),
  ],
  telemetry: {
    enabled: false,
  },
  secondaryStorage: {
    get: async (key) => {
      return await redis.get(`${namespace}:${key}`)
    },
    set: async (key, value, ttl) => {
      if (ttl) {
        await redis.set(`${namespace}:${key}`, value, "EX", ttl)
      } else {
        await redis.set(`${namespace}:${key}`, value)
      }
    },
    delete: async (key) => {
      await redis.del(`${namespace}:${key}`)
    },
  },
  advanced: {
    cookiePrefix: "sanipatitas",
    database: {
      generateId: () => Bun.randomUUIDv7(),
    },
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
    },
  },
  trustedOrigins: [
    "tauri://localhost",
    "http://tauri.localhost",
    "http://localhost:1420",
  ],
  experimental: { joins: true },
})

// Type
export type Auth = typeof auth.$Infer.Session
export type AuthUser = typeof auth.$Infer.Session.user
export type AuthSession = typeof auth.$Infer.Session.session
export type AuthErrorCode = keyof typeof auth.$ERROR_CODES
