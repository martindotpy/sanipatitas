import { logger as elysiaLogger } from "@bogeychan/elysia-logger"
import type {
  Logger as ElysiaLogger,
  ElysiaLoggerOptions,
} from "@bogeychan/elysia-logger/types"
import { isDev } from "@sanipatitas/shared/app-context"

// Types
export type Logger = ElysiaLogger

// Configuration
const loggerConfiguration: ElysiaLoggerOptions = {
  customProps(ctx) {
    const ip = ctx.request.headers.get("x-real-ip") || undefined
    const store = (ctx as Record<string, unknown>).store as
      Record<string, unknown> | undefined
    const correlationId =
      (store?.correlationId as string) ||
      ctx.request.headers.get("x-correlation-id") ||
      undefined

    return { ip, correlationId }
  },
}

// Middleware
export const loggerMiddleware = elysiaLogger({
  level: "debug",
  customProps: loggerConfiguration.customProps,
  autoLogging: {
    ignore: isDev
      ? (ctx) =>
          new URL(ctx.request.url).pathname.endsWith("/api/auth/openapi.json")
      : (ctx) => new URL(ctx.request.url).pathname.endsWith("/_health"),
  },
})
