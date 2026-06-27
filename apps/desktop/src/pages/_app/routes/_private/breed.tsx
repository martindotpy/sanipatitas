import { BreedSection } from "@sanipatitas/desktop/breed/components/sections/breed-section"
import { $title } from "@sanipatitas/desktop/home/store/title-store"
import { SpeciesSection } from "@sanipatitas/desktop/species/components/sections/species-section"
import { Separator } from "@sanipatitas/ui/components/ui/separator"
import { cn } from "@sanipatitas/ui/lib/tailwind"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"

// Route
export const Route = createFileRoute("/_private/breed")({
  component: BreedComponent,
})

function BreedComponent() {
  // Update title
  useEffect(() => {
    $title.set("Especies y razas")
  }, [])

  return (
    <div className={cn("flex min-w-0 flex-1 p-4", "gap-4 max-md:flex-col")}>
      <SpeciesSection />

      <Separator orientation="vertical" className="max-md:hidden" />
      <Separator orientation="horizontal" className="md:hidden" />

      <BreedSection />
    </div>
  )
}
