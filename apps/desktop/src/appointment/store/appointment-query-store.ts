import { atom } from "nanostores"

// Types
export interface AppointmentQueryState {
  from: string
  to: string
}

// Store
export const $appointmentQuery = atom<AppointmentQueryState>({
  from: "",
  to: "",
})
