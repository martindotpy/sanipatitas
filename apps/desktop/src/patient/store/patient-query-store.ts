import { useStore } from "@nanostores/react"
import { atom } from "nanostores"

// Types
export interface PatientQuery {
  page: number
  size: number
  search?: string
}

// Store
export const $patientQuery = atom<PatientQuery>({
  page: 0,
  size: 20,
})

// Hook
export const usePatientQuery = () => useStore($patientQuery)
