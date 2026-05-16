import { useStore } from "@nanostores/react"
import { atom } from "nanostores"

// Store
export const $jwt = atom<string | null>(null)

// Hook
export function useJwt() {
  const jwt = useStore($jwt)

  return jwt
}
