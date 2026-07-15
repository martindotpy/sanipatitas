import { InventorySection } from "@sanipatitas/desktop/inventory/components/sections/inventory-section"
import { $title } from "@sanipatitas/desktop/home/store/title-store"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"

// Route
export const Route = createFileRoute("/_private/inventory")({
  component: InventoryComponent,
})

function InventoryComponent() {
  useEffect(() => {
    $title.set("Inventario")
  }, [])

  return <InventorySection />
}
