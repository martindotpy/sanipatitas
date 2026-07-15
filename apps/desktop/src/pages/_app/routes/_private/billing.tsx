import { BillingSection } from "@sanipatitas/desktop/billing/components/sections/billing-section"
import { $title } from "@sanipatitas/desktop/home/store/title-store"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"

// Route
export const Route = createFileRoute("/_private/billing")({
  component: BillingComponent,
})

function BillingComponent() {
  useEffect(() => {
    $title.set("Facturación")
  }, [])

  return <BillingSection />
}
