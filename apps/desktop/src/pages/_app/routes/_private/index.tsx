import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useEffect } from "react"

// Route
export const Route = createFileRoute("/_private/")({
  component: IndexComponent,
})

function IndexComponent() {
  const router = useRouter()

  useEffect(() => {
    router.navigate({ to: "/patient" })
  }, [router])

  return <></>
}
