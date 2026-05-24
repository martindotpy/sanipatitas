import { auth } from "@sanipatitas/auth/auth/configuration/auth-configuration"
import Elysia from "elysia"

// Controller
export const authController = new Elysia().mount(auth.handler)
