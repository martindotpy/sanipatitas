// Environment
declare module "bun" {
  interface Env {
    // Database
    readonly DATABASE_URL: string

    // Better auth
    readonly BETTER_AUTH_SECRET: string
    readonly BETTER_AUTH_URL: string

    // Email
    readonly RESEND_API_KEY: string
    readonly EMAIL_FROM: string
  }
}
