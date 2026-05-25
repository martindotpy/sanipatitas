import { SpeciesActions } from "@sanipatitas/desktop/species/components/organisms/species-actions"
import { SpeciesTable } from "@sanipatitas/desktop/species/components/organisms/species-table"

// Component
export function SpeciesSection() {
  return (
    <section className="flex flex-1 flex-col gap-4">
      <SpeciesActions />
      <SpeciesTable />
    </section>
  )
}
