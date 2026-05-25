import { useStore } from "@nanostores/react"
import { atom } from "nanostores"

// Store
export const $title = atom<string | null>(null)

// Hook
export function useTitle() {
  const title = useStore($title)

  return title
}
