import { isSsr } from "@sanipatitas/desktop/core/configuration/app-configuration"
import {
  type AppRouter,
  createAppRouter,
} from "@sanipatitas/desktop/pages/_app/router"
import { RouterProvider } from "@tanstack/react-router"
import { RouterClient } from "@tanstack/react-router/ssr/client"

let clientRouter: AppRouter | undefined

if (!isSsr) {
  clientRouter = createAppRouter()
}

export function AppEntry({
  getServerRouter,
  clientOnly,
}: {
  getServerRouter?: () => AppRouter
  clientOnly?: boolean
}) {
  return clientOnly ? (
    <RouterProvider router={clientRouter!} />
  ) : isSsr ? (
    <RouterProvider router={getServerRouter!()} />
  ) : (
    <RouterClient router={clientRouter!} />
  )
}
