import { $deepLinkPatientId } from "@sanipatitas/desktop/patient/store/patient-deeplink-store"
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
    if (params.uuid) $deepLinkPatientId.set(params.uuid)

    // Drop the /$uuid segment; PatientTable opens the sheet from the store.
    router.navigate({ to: "/patient", replace: true })
  }, [router, params.uuid])

  return null
}
