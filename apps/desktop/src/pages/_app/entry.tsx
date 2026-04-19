import { isSsr } from "@sanipatitas/desktop/core/configuration/app-configuration"
import {
  type AppRouter,
  createAppRouter,
} from "@sanipatitas/desktop/pages/_app/router"
import { RouterProvider } from "@tanstack/react-router"
import { RouterClient } from "@tanstack/react-router/ssr/client"

// Router
let clientRouter: AppRouter | undefined

if (!isSsr) {
  clientRouter = createAppRouter()
}

// Entry
interface AppEntryProps {
  getServerRouter?: () => AppRouter
  clientOnly?: boolean
}

export function AppEntry({ getServerRouter, clientOnly }: AppEntryProps) {
  return clientOnly ? (
    <RouterProvider router={clientRouter!} />
  ) : isSsr ? (
    <RouterProvider router={getServerRouter!()} />
  ) : (
    <RouterClient router={clientRouter!} />
  )
}
