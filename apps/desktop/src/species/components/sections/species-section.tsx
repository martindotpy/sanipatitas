import { SpeciesTable } from "@sanipatitas/desktop/species/components/organisms/species-table"
import { Section } from "@sanipatitas/ui/components/organisms/section"

// Component
export function SpeciesSection() {
  return (
    <Section className="flex w-full min-w-0 flex-1 flex-col gap-4 p-0">
      <SpeciesTable />
    </Section>
  )
}
