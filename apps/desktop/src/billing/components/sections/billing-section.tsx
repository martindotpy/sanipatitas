import { BillingTable } from "@sanipatitas/desktop/billing/components/organisms/billing-table"
import { CreateBilling } from "@sanipatitas/desktop/billing/components/organisms/create-billing"
import { Section } from "@sanipatitas/ui/components/organisms/section"
import { H2 } from "@sanipatitas/ui/components/ui/typography"
import { Muted } from "@sanipatitas/ui/components/ui/typography/muted"

// Component
export function BillingSection() {
  return (
    <Section className="flex w-full min-w-0 flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <H2>Facturación</H2>
          <Muted>Gestión de facturas, cobros y pagos.</Muted>
        </div>
        <CreateBilling />
      </div>
      <BillingTable />
    </Section>
  )
}
