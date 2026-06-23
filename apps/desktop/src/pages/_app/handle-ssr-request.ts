import { createAppRouter } from "@sanipatitas/desktop/pages/_app/router"
import { createRequestHandler } from "@tanstack/react-router/ssr/server"
import type { AstroGlobal } from "astro"

export async function handleSsrRequest(astro: AstroGlobal) {
  // Server
  const router = createAppRouter(astro)
  let scriptHtml = ""

  const getServerRouter = () => router

  // Request
  const handler = createRequestHandler({
    request: new Request(astro.request.url.replace(".html", ""), astro.request),
    createRouter: getServerRouter,
  })

  // Handle the request and extract the buffered scripts before cleanup runs
  const response = await handler(({ router, responseHeaders }) => {
    // Extract buffered scripts inside the callback before cleanup runs
    const bufferedScripts = router.serverSsr?.takeBufferedScripts()

    if (bufferedScripts?.tag === "script") {
      const scriptAttr = bufferedScripts.attrs
        ? " " +
          Object.entries(bufferedScripts.attrs)
            .map(([key, value]) => (value ? `${key}="${value}"` : key))
            .join(" ")
        : ""

      scriptHtml = `<script${scriptAttr}>${bufferedScripts.children}</script>`
    }

    return new Response(null, {
      status: router.stores.statusCode.get(),
      headers: responseHeaders,
    })
  })

  // Redirect
  if (response.status >= 300 && response.status < 400) {
    return { redirectResponse: response, getServerRouter, scriptHtml: "" }
  }

  // Script
  return { redirectResponse: null, getServerRouter, scriptHtml }
}
