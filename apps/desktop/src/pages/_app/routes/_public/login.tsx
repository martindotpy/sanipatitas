import { DraggableHeader } from "@sanipatitas/ui/components/molecules/draggable-header"
import { PublicFooter } from "@sanipatitas/ui/components/molecules/public-footer"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_public/login")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <DraggableHeader />

      <main className="flex flex-1">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-1">
            <h1>Login</h1>
          </div>

          <PublicFooter />
        </div>

        <aside className="flex-2 max-lg:hidden">Hola</aside>
      </main>
    </>
  )
}
