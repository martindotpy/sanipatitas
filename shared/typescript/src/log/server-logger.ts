import { isDev } from "@sanipatitas/shared/app-context"
import pino, { type Logger } from "pino"

// Type
export type Log = Logger

// Stream
const devStream = isDev
  ? await import("./transport/consola-transport.js").then((m) => m.default())
  : undefined

// Logger
export const serverLoggerOptions: pino.LoggerOptions = {
  level: "debug",
  serializers: {
    err: pino.stdSerializers.err,
  },
  ...(isDev ? { base: undefined } : {}),
}

export const serverLog =
  isDev && devStream
    ? pino(serverLoggerOptions, devStream) // Stream directo, sin worker
    : pino(serverLoggerOptions)
