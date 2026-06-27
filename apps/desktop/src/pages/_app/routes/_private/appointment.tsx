import { AppointmentSection } from "@sanipatitas/desktop/appointment/components/sections/appointment-section"
import { $title } from "@sanipatitas/desktop/home/store/title-store"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"

// Route
export const Route = createFileRoute("/_private/appointment")({
  component: AppointmentComponent,
})

function AppointmentComponent() {
  // Update title
  useEffect(() => {
    $title.set("Calendario")
  }, [])

  return <AppointmentSection />
}
