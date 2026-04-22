import { isDev } from "@sanipatitas/desktop/core/configuration/app-configuration"
import {
  getTanstackQueryContext,
  TanstackQueryProvider,
} from "@sanipatitas/desktop/core/integrations/tanstack-query-integration"
import { routeTree } from "@sanipatitas/desktop/pages/_app/routeTree.gen"
import { ErrorMainSection } from "@sanipatitas/ui/components/organisms/error-main-section"
import { NotFoundMainSection } from "@sanipatitas/ui/components/organisms/not-found-main-section"
import { TooltipProvider } from "@sanipatitas/ui/components/ui/tooltip"
import { DefaultLoadingPage } from "@sanipatitas/ui/src/components/template/default-loading-page"
import { dehydrate, hydrate } from "@tanstack/react-query"
import { createRouter, ErrorComponent } from "@tanstack/react-router"
import type { AstroGlobal } from "astro"
import { ThemeProvider } from "next-themes"
import * as React from "react"

// Router
export function createAppRouter(astro?: AstroGlobal) {
  const tanstackQueryContext = getTanstackQueryContext()

  const router = createRouter({
    routeTree,
    context: { astro, ...tanstackQueryContext },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    dehydrate: () => {
      return {
        queryClientState: dehydrate(tanstackQueryContext.queryClient),
      }
    },
    hydrate: (dehydrated) => {
      hydrate(tanstackQueryContext.queryClient, dehydrated.queryClientState)
    },
    Wrap: ({ children }: { children: React.ReactNode }) => {
      return (
        <React.StrictMode>
          <TanstackQueryProvider {...tanstackQueryContext}>
            <TooltipProvider>
              <ThemeProvider attribute="class">{children}</ThemeProvider>
            </TooltipProvider>
          </TanstackQueryProvider>
        </React.StrictMode>
      )
    },
    defaultPendingComponent: DefaultLoadingPage,
    defaultNotFoundComponent: () => (
      <div className="flex flex-1 flex-col">
        <NotFoundMainSection />
      </div>
    ),
    defaultErrorComponent: ({ error }) => {
      return (
        <div className="flex flex-1 flex-col">
          {isDev ? <ErrorComponent error={error} /> : <ErrorMainSection />}
        </div>
      )
    },
    defaultViewTransition: true,
    scrollRestoration: true,
    defaultPreload: "intent",
  })

  return router
}

export type AppRouter = ReturnType<typeof createAppRouter>

declare module "@tanstack/react-router" {
  interface Register {
    router: AppRouter
  }

  interface StaticDataRouteOption {
    creationMode?: boolean
    editMode?: boolean
    manualMode?: boolean
    aiMode?: boolean
  }
}
