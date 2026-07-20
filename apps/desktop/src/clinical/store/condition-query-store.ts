import { useStore } from "@nanostores/react"
import { atom } from "nanostores"

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
