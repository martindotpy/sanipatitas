import { createFileRoute } from "@tanstack/react-router"

// Route
export const Route = createFileRoute("/_private/patient")({
  component: PatientComponent,
})

function PatientComponent() {
  return <></>
}
