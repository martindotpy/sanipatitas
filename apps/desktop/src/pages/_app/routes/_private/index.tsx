import { DashboardSection } from "@sanipatitas/desktop/dashboard/components/sections/dashboard-section"
import { $title } from "@sanipatitas/desktop/home/store/title-store"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"

// Route
export const Route = createFileRoute("/_private/")({
  component: IndexComponent,
})

function IndexComponent() {
  useEffect(() => {
    $title.set("Dashboard")
  }, [])

  return <DashboardSection />
}
