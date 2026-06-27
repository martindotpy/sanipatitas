import { BreedTable } from "@sanipatitas/desktop/breed/components/organisms/breed-table"
import { Section } from "@sanipatitas/ui/components/organisms/section"
import { H2 } from "@sanipatitas/ui/components/ui/typography"
import { Muted } from "@sanipatitas/ui/components/ui/typography/muted"

export function BreedSection() {
  return (
    <Section className="flex w-full min-w-0 flex-1 flex-col gap-4 p-0">
      <div>
        <H2>Razas</H2>
        <Muted>Gestión de razas asociadas a las especies.</Muted>
      </div>
      <BreedTable />
    </Section>
  )
}
