import { cors } from "@elysia/cors"
import { authController } from "@sanipatitas/auth/auth/controller/auth-controller"
import { port } from "@sanipatitas/auth/core/configuration/app-configuration"
import { miscellaneousController } from "@sanipatitas/auth/core/controller/miscellaneous-controller"
import { initializeApp } from "@sanipatitas/auth/core/initializer"
import { openapiMiddleware } from "@sanipatitas/auth/core/middleware/openapi-middleware"
import { isDev } from "@sanipatitas/shared/app-context"
import { serverLog } from "@sanipatitas/shared/log/server-logger"
import { loggerMiddleware } from "@sanipatitas/shared/middleware/logger-middleware"
import Elysia from "elysia"

// Api
export const api = new Elysia({ aot: true, precompile: true })
  .use(
    cors({
      origin: [
        "tauri://localhost",
        "http://tauri.localhost",
        ...(isDev ? ["http://localhost:1420"] : []),
      ],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      maxAge: 3600,
    })
  )
  .use(loggerMiddleware)
  .use(openapiMiddleware)
  .use(miscellaneousController)
  .use(authController)

await initializeApp()

api.listen(port, () => {
  serverLog.info(`Auth service is running on port %d`, port)
})
