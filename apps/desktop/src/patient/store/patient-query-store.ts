import { atom } from "nanostores"
import { useStore } from "@nanostores/react"

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
