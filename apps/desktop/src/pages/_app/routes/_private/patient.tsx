import { $title } from "@sanipatitas/desktop/home/store/title-store"
import { PatientSection } from "@sanipatitas/desktop/patient/components/sections/patient-section"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useEffect } from "react"

// Route
export const Route = createFileRoute("/_private/patient")({
  component: PatientComponent,
})

function PatientComponent() {
  // Update title
  useEffect(() => {
    $title.set("Pacientes")
  }, [])

  return (
    <>
      <PatientSection />
      {/* Renders the /patient/$uuid child route (QR deep link) so its redirect runs */}
      <Outlet />
    </>
  )
}
