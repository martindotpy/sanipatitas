import { SpeciesTable } from "@sanipatitas/desktop/species/components/organisms/species-table"
import { Section } from "@sanipatitas/ui/components/organisms/section"
import { H2 } from "@sanipatitas/ui/components/ui/typography"
import { Muted } from "@sanipatitas/ui/components/ui/typography/muted"

// Component
export function SpeciesSection() {
  return (
    <Section className="flex w-full min-w-0 flex-1 flex-col gap-4 p-0">
      <div>
        <H2>Especies</H2>
        <Muted>Gestión de especies registradas en el sistema.</Muted>
      </div>
      <SpeciesTable />
    </Section>
  )
}
