import { atom } from "nanostores"
import { useStore } from "@nanostores/react"

// Types
export interface ConditionQuery {
  patientId: string
  page: number
  size: number
}

// Store
export const $conditionQuery = atom<ConditionQuery>({
  patientId: "",
  page: 0,
  size: 20,
})

// Hook
export const useConditionQuery = () => useStore($conditionQuery)
