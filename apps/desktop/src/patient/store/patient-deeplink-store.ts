import { atom } from "nanostores"

// Holds the patient UUID coming from a QR deep link (sanipatitas://patient/{uuid}
// or /patient/{uuid}). PatientTable reads it to open that patient's details sheet.
export const $deepLinkPatientId = atom<string | null>(null)
