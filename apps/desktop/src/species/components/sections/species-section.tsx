import { SpeciesTable } from "@sanipatitas/desktop/species/components/organisms/species-table"
import { H1 } from "@sanipatitas/ui/components/ui/typography/h1"
import { Muted } from "@sanipatitas/ui/components/ui/typography/muted"
import { Section } from "@sanipatitas/ui/components/organisms/section"

// Component
export function SpeciesSection() {
  return (
    <Section className="flex w-full min-w-0 flex-1 flex-col gap-4 p-0">
      <H1>Especies</H1>
      <Muted>Gestión de especies registradas en el sistema.</Muted>
      <SpeciesTable />
    </Section>
  )
}
