import { $title } from "@sanipatitas/desktop/home/store/title-store"
import { SpeciesSection } from "@sanipatitas/desktop/species/components/sections/species-section"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"

// Route
export const Route = createFileRoute("/_private/species")({
  component: SpeciesComponent,
})

function SpeciesComponent() {
  // Update title
  useEffect(() => {
    $title.set("Especies")
  }, [])

  return (
    <div className="flex flex-1 p-4">
      <SpeciesSection />
    </div>
  )
}
