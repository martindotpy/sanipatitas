import { createFileRoute } from "@tanstack/react-router"

// Route
export const Route = createFileRoute("/_private/clients")({
  component: ClientsComponent,
})

function ClientsComponent() {
  return <></>
}
