import cors from "@elysia/cors"
import { isDev } from "@sanipatitas/shared/app-context"

// Middleware
export const corsMiddleware = cors({
  origin: [
    "tauri://localhost",
    "https://tauri.localhost",
    ...(isDev ? ["http://localhost:1420"] : []),
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 3600,
})
