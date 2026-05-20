import { createFileRoute } from "@tanstack/react-router"

// Route
export const Route = createFileRoute("/_private/breeds")({
  component: BreedsComponent,
})

function BreedsComponent() {
  return <></>
}
