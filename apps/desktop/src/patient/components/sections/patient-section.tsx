import { PatientTable } from "@sanipatitas/desktop/patient/components/organisms/patient-table"
import { Section } from "@sanipatitas/ui/components/organisms/section"
import { H2 } from "@sanipatitas/ui/components/ui/typography"
import { Muted } from "@sanipatitas/ui/components/ui/typography/muted"

export function PatientSection() {
  return (
    <Section className="flex w-full min-w-0 flex-1 flex-col gap-4 p-4">
      <div>
        <H2>Pacientes</H2>
        <Muted>Gestión de mascotas y pacientes.</Muted>
      </div>
      <PatientTable />
    </Section>
  )
}
