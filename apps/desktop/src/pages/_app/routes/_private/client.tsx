import { ClientSection } from "@sanipatitas/desktop/client/components/sections/client-section"
import { $title } from "@sanipatitas/desktop/home/store/title-store"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"

// Route
export const Route = createFileRoute("/_private/client")({
  component: ClientComponent,
})

function ClientComponent() {
  // Update title
  useEffect(() => {
    $title.set("Clientes")
  }, [])

  return (
    <div className="flex flex-1 p-4">
      <ClientSection />
    </div>
  )
}
