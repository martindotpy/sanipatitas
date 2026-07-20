import { useStore } from "@nanostores/react"
import { atom } from "nanostores"

// Types
export interface ClientQuery {
  page: number
  size: number
  search?: string
}

// Store
export const $clientQuery = atom<ClientQuery>({
  page: 0,
  size: 20,
})

// Hook
export const useClientQuery = () => useStore($clientQuery)
