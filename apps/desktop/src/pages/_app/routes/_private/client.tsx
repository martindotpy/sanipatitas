import { createFileRoute } from "@tanstack/react-router"

// Route
export const Route = createFileRoute("/_private/client")({
  component: ClientComponent,
})

function ClientComponent() {
  return <></>
}
