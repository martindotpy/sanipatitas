import { UserTable } from "@sanipatitas/desktop/admin/components/organisms/user-table"
import { Section } from "@sanipatitas/ui/components/organisms/section"
import { H2 } from "@sanipatitas/ui/components/ui/typography"
import { Muted } from "@sanipatitas/ui/components/ui/typography/muted"

// Component
export function AdminSection() {
  return (
    <Section className="flex w-full min-w-0 flex-1 flex-col gap-4 p-4">
      <div>
        <H2>Usuarios</H2>
        <Muted>Gestión de usuarios del sistema.</Muted>
      </div>
      <UserTable />
    </Section>
  )
}
