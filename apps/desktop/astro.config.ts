import node from "@astrojs/node"
import react from "@astrojs/react"
import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import astroPwa from "@vite-pwa/astro"
import compress from "astro-compress"
import { defineConfig, fontProviders } from "astro/config"
import checker from "vite-plugin-checker"
import svgr from "vite-plugin-svgr"

// Context
const { DEV: isDev } = import.meta.env

const site = process.env.COOLIFY_URL || "https://sanipatitas.martindotpy.dev"

// Config
export default defineConfig({
  site,
  trailingSlash: "never",

  integrations: [
    react({ babel: { plugins: ["babel-plugin-react-compiler"] } }),
    astroPwa({
      injectRegister: false,
      pwaAssets: {
        config: true,
      },
      manifest: {
        theme_color: "#0a0a0a",
        background_color: "#0a0a0a",
      },
      devOptions: {
        enabled: false,
        navigateFallbackAllowlist: [],
      },
    }),
    compress({
      HTML: {
        "html-minifier-terser": false,
      },
      Exclude: "favicon.svg",
    }),
  ],

  server: {
    port: 1420,
  },

  vite: {
    plugins: [
      devtools(),
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
        routesDirectory: "src/pages/_app/routes",
        generatedRouteTree: "src/pages/_app/routeTree.gen.ts",
        routeFileIgnorePrefix: "-",
        quoteStyle: "double",
      }),
      svgr(),
      ...(isDev
        ? [
            checker({
              typescript: true,
            }),
          ]
        : []),
      tailwindcss(),
    ],
    envPrefix: "PUBLIC_",
    server: {
      proxy: {
        "/api/auth": "http://localhost:3000",
        "/api/core": "http://localhost:8080",
      },
    },
  },

  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Geist",
        cssVariable: "--font-geist",
        subsets: ["latin"],
        weights: ["100 900"],
        styles: ["normal"],
      },
    ],
    contentIntellisense: true,
  },

  image: { layout: "constrained" },

  // Not necessary because pre-caching of the workbox was configured
  prefetch: false,

  devToolbar: {
    enabled: false,
  },

  adapter: node({ mode: "standalone" }),
})
