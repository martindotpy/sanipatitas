import { isTauri as checkIsTauri } from "@tauri-apps/api/core"
import { type } from "@tauri-apps/plugin-os"
import z from "zod"

// Environment
type KeyEnv = { [K in keyof ImportMetaEnv]?: unknown }

export const {
  DEV: isDev,
  PROD: isProd,
  SITE: site,
  SSR: isSsr,
  PUBLIC_BASE_URL: publicBaseUrl,
} = (
  z.object({
    BASE_URL: z.string(),
    DEV: z.coerce.boolean(),
    PROD: z.coerce.boolean(),
    SITE: z.string(),
    SSR: z.coerce.boolean(),
    MODE: z.enum(["development", "production", "test"]).default("development"),
    PUBLIC_BASE_URL: z.string().optional(),
  }) satisfies z.ZodType<KeyEnv>
).parse(import.meta.env)

// Url
export const siteUrl = new URL(site)

// Tauri
export const isTauri = checkIsTauri()

// Os
export const os = isSsr ? null : isTauri ? type() : null
