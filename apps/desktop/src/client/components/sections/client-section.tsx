import { ClientTable } from "@sanipatitas/desktop/client/components/organisms/client-table"
import { Section } from "@sanipatitas/ui/components/organisms/section"
import { H2 } from "@sanipatitas/ui/components/ui/typography"
import { Muted } from "@sanipatitas/ui/components/ui/typography/muted"

export function ClientSection() {
  return (
    <Section className="flex w-full min-w-0 flex-1 flex-col gap-4 p-5">
      <div>
        <H2>Clientes</H2>
        <Muted>Gestión de dueños de mascotas.</Muted>
      </div>
      <ClientTable />
    </Section>
  )
}
