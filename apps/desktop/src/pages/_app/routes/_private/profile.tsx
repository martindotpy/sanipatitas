import { createFileRoute } from "@tanstack/react-router"

// Route
export const Route = createFileRoute("/_private/profile")({
  component: ProfileComponent,
})

function ProfileComponent() {
  return <></>
}
