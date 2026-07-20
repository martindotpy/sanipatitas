import { uuidV7 } from "@sanipatitas/shared/lib/uuid"
import Elysia from "elysia"

// Middleware que genera/propaga correlation_id para tracing
// Debe ir ANTES del logger middleware y del audit middleware
export const tracingMiddleware = new Elysia({
  name: "tracing-middleware",
}).derive(({ request, set, store }) => {
  const correlationId = request.headers.get("x-correlation-id") ?? uuidV7()

  set.headers["X-Correlation-Id"] = correlationId
  ;(store as Record<string, unknown>).correlationId = correlationId

  return { correlationId }
})
