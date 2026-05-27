import { $title } from "@sanipatitas/desktop/home/store/title-store"
import { createFileRoute } from "@tanstack/react-router"
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

  return <></>
}
