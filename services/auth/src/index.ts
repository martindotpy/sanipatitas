import { authController } from "@sanipatitas/auth/auth/controller/auth-controller"
import { port } from "@sanipatitas/auth/core/configuration/app-configuration"
import { miscellaneousController } from "@sanipatitas/auth/core/controller/miscellaneous-controller"
import { initializeApp } from "@sanipatitas/auth/core/initializer"
import { openapiMiddleware } from "@sanipatitas/auth/core/middleware/openapi-middleware"
import { loggerMiddleware } from "@sanipatitas/shared/middleware/logger-middleware"
import Elysia from "elysia"

// Api
export const api = new Elysia({ aot: true, precompile: true })
  .use(loggerMiddleware)
  .use(openapiMiddleware)
  .use(miscellaneousController)
  .use(authController)

await initializeApp()

api.listen(port, () => {
  console.log(
    `🚀 Auth service listening on port ${port}. http://localhost:${port}`
  )
})
