import { atom } from "nanostores"
import { useStore } from "@nanostores/react"

// Types
export interface PrescriptionQuery {
  patientId: string
  page: number
  size: number
}

// Store
export const $prescriptionQuery = atom<PrescriptionQuery>({
  patientId: "",
  page: 0,
  size: 20,
})

// Hook
export const usePrescriptionQuery = () => useStore($prescriptionQuery)
