import { createFileRoute } from "@tanstack/react-router"

// Route
export const Route = createFileRoute("/_private/patients")({
  component: PatientsComponent,
})

function PatientsComponent() {
  return <></>
}
