import { DraggableHeader } from "@sanipatitas/desktop/core/components/molecules/draggable-header"
import { SignInForm } from "@sanipatitas/desktop/sign-in/components/organisms/sign-in-form"
import { PublicFooter } from "@sanipatitas/ui/components/molecules/public-footer"
import { createFileRoute } from "@tanstack/react-router"

// Sign-in route
export const Route = createFileRoute("/_public/sign-in")({
  component: SignInComponent,
})

function SignInComponent() {
  return (
    <>
      <DraggableHeader />

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
