import { createFileRoute } from "@tanstack/react-router"


// Route
export const Route = createFileRoute("/_private/species")({
  component: SpeciesComponent,
})

function SpeciesComponent() {
  return <></>
}
