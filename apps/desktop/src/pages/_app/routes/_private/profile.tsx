import { ProfileSection } from "@sanipatitas/desktop/auth/components/sections/profile-section"
import { $title } from "@sanipatitas/desktop/home/store/title-store"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"

// Route
export const Route = createFileRoute("/_private/profile")({
  component: ProfileComponent,
})

function ProfileComponent() {
  useEffect(() => {
    $title.set("Mi Perfil")
  }, [])

  return <ProfileSection />
}
