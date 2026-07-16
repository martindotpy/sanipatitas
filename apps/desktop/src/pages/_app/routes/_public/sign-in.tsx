import { SignInForm } from "@sanipatitas/desktop/sign-in/components/organisms/sign-in-form"
import { PublicFooter } from "@sanipatitas/ui/components/molecules/public-footer"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import { toast } from "sonner"
import { z } from "zod"

// Sign-in route
export const Route = createFileRoute("/_public/sign-in")({
  validateSearch: z.object({
    verified: z.coerce.boolean().optional(),
    error: z.string().optional(),
  }),
  component: SignInComponent,
})

function SignInComponent() {
  // Verification callback
  const { verified, error } = Route.useSearch()

  useEffect(() => {
    if (verified) {
      toast.success("¡Correo verificado! Ya puedes ingresar.")
    } else if (error) {
      toast.error(
        "No se pudo verificar el correo. El enlace puede haber expirado, solicita uno nuevo."
      )
    }
  }, [verified, error])

  return (
    <>
      <main className="flex flex-1">
        <div className="flex flex-2 flex-col items-center justify-center p-5">
          <SignInForm />

          <PublicFooter />
        </div>

        <aside className="bg-card flex-3 border-l max-lg:hidden"></aside>
      </main>
    </>
  )
}
