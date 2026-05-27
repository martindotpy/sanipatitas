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

  return <></>
}
