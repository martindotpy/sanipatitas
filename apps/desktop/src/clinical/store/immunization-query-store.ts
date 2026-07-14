import { atom } from "nanostores"
import { useStore } from "@nanostores/react"

// Store
export const $immunizationQuery = atom<{
  patientId: string | null
  page: number
  size: number
}>({
  patientId: null,
  page: 0,
  size: 10,
})

// Hook
export function useImmunizationQuery() {
  return useStore($immunizationQuery)
}
