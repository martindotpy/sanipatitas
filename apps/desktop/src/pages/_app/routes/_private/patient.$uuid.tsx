import { createFileRoute, useParams, useRouter } from "@tanstack/react-router"
import { useEffect } from "react"

// Route
export const Route = createFileRoute("/_private/patient/$uuid")({
  component: PatientUuidRedirect,
})

function PatientUuidRedirect() {
  const router = useRouter()
  const params = useParams({ strict: false })

  useEffect(() => {
    router.navigate({ href: `/patient?id=${params.uuid}` })
  }, [router, params.uuid])

  return null
}
