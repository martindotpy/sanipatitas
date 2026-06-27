import { uuidV7 } from "@sanipatitas/shared/lib/uuid"
import { serverLog } from "@sanipatitas/shared/log/server-logger"
import Elysia from "elysia"

// Types
type AuditLogEntry = {
  type: string
  when: string
  service: string
  correlationId: string
  who: string
  role: string
  action: string
  resourceType: string
  resourceId: string | null
  method: string
  path: string
  status: string
  durationMs: string
}

type JwtPayload = {
  sub?: string
  group?: string
  role?: string
}

// Constants
const criticalMethods = new Set(["POST", "PUT", "PATCH", "DELETE"])

// Middleware
export const auditMiddleware = new Elysia({ name: "audit-middleware" })
  .derive(({ request, store }) => ({
    auditCorrelationId:
      (store as Record<string, string>).correlationId ??
      request.headers.get("x-correlation-id") ??
      uuidV7(),
    auditStartedAt: Date.now(),
  }))
  .onAfterResponse(
    ({ auditCorrelationId, auditStartedAt, request, set }) => {
      if (!criticalMethods.has(request.method)) {
        return
      }

      const url = new URL(request.url)
      const payload = getJwtPayload(request)
      const entry: AuditLogEntry = {
        type: "audit",
        when: new Date().toISOString(),
        service: "auth",
        correlationId: auditCorrelationId,
        who: payload.sub ?? "anonymous",
        role: payload.group ?? payload.role ?? "unknown",
        action: actionFromMethod(request.method),
        resourceType: resourceTypeFromPath(url.pathname),
        resourceId: resourceIdFromPath(url.pathname),
        method: request.method,
        path: url.pathname,
        status: String(set.status),
        durationMs: String(Date.now() - auditStartedAt),
      }

      set.headers["X-Correlation-Id"] = auditCorrelationId
      serverLog.info(entry, "critical_transaction")
    }
  )

// Jwt
const getJwtPayload = (request: Request): JwtPayload => {
  const authorization = request.headers.get("authorization")
  const token = authorization?.replace(/^Bearer\s+/i, "")
  const payload = token?.split(".")[1]

  if (!payload) {
    return {}
  }

  try {
    const base64 = payload.replaceAll("-", "+").replaceAll("_", "/")
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    )

    return JSON.parse(
      Buffer.from(padded, "base64").toString("utf8")
    ) as JwtPayload
  } catch {
    return {}
  }
}

// Action
const actionFromMethod = (method: string) => {
  if (method === "POST") return "CREATE"
  if (method === "PUT" || method === "PATCH") return "UPDATE"
  if (method === "DELETE") return "DELETE"

  return "UNKNOWN"
}

// Resource
const resourceTypeFromPath = (path: string) => {
  const segments = path.split("/").filter(Boolean)

  return segments[1] ?? "unknown"
}

const resourceIdFromPath = (path: string) => {
  const segments = path.split("/").filter(Boolean)
  const candidate = segments.at(-1)

  if (!candidate || candidate === resourceTypeFromPath(path)) {
    return null
  }

  return candidate
}
