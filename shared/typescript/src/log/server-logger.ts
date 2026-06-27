import { isDev } from "@sanipatitas/shared/app-context"
import pino, { type Logger } from "pino"

// Type
export type Log = Logger

// Streams
const devStream = isDev
  ? await import("./transport/consola-transport.js").then((m) => m.default())
  : undefined

const lokiStream = !isDev
  ? (await import("./transport/loki-transport.js")).lokiTransport
  : undefined

// Logger
export const serverLoggerOptions: pino.LoggerOptions = {
  level: "debug",
  serializers: {
    err: pino.stdSerializers.err,
  },
  ...(isDev ? { base: undefined } : {}),
}

// Dev: Consola stream   Prod con Loki: Loki + stdout   Prod sin Loki: stdout JSON
export const serverLog = (() => {
  if (isDev && devStream) {
    return pino(serverLoggerOptions, devStream)
  }

  if (!isDev && lokiStream) {
    return pino(serverLoggerOptions, lokiStream)
  }

  return pino(serverLoggerOptions)
})()
