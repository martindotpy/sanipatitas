import { createFileRoute } from "@tanstack/react-router"

// Route
export const Route = createFileRoute("/_private/")({
  component: IndexComponent,
})

function IndexComponent() {
  return <>¡Hola!</>
}
