import { AdminSection } from "@sanipatitas/desktop/admin/components/sections/admin-section"
import { $title } from "@sanipatitas/desktop/home/store/title-store"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"

// Route
export const Route = createFileRoute("/_private/admin/users")({
  component: AdminUsersComponent,
})

function AdminUsersComponent() {
  useEffect(() => {
    $title.set("Usuarios")
  }, [])

  return <AdminSection />
}