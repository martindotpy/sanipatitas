import { AppointmentCalendarView } from "@sanipatitas/desktop/appointment/components/organisms/appointment-calendar-view"
import { Section } from "@sanipatitas/ui/components/organisms/section"
import { H2 } from "@sanipatitas/ui/components/ui/typography"
import { Muted } from "@sanipatitas/ui/components/ui/typography/muted"

export function AppointmentSection() {
  return (
    <Section className="flex w-full min-w-0 flex-1 flex-col gap-4 p-0">
      <div className="px-4 pt-4">
        <H2>Calendario</H2>
        <Muted>Gestión de citas y consultas.</Muted>
      </div>
      <div className="flex flex-1 px-4 pb-4">
        <AppointmentCalendarView />
      </div>
    </Section>
  )
}
