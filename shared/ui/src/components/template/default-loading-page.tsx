import { ClientOnly } from "@tanstack/react-router"
import { lazy, Suspense } from "react"

// Animations
const ANIMATIONS = [
  lazy(() =>
    import("@sanipatitas/ui/components/atoms/ambulance-animated").then((m) => ({
      default: m.AmbulanceAnimated,
    }))
  ),
  lazy(() =>
    import("@sanipatitas/ui/components/atoms/cat-animated").then((m) => ({
      default: m.CatAnimated,
    }))
  ),
  lazy(() =>
    import("@sanipatitas/ui/components/atoms/duck-animated").then((m) => ({
      default: m.DuckAnimated,
    }))
  ),
  lazy(() =>
    import("@sanipatitas/ui/components/atoms/heart-beat-animated").then(
      (m) => ({ default: m.HeartBeatAnimated })
    )
  ),
  lazy(() =>
    import("@sanipatitas/ui/components/atoms/injection-animated").then((m) => ({
      default: m.InjectionAnimated,
    }))
  ),
  lazy(() =>
    import("@sanipatitas/ui/components/atoms/maneki-cat-animated").then(
      (m) => ({ default: m.ManekiCatAnimated })
    )
  ),
  lazy(() =>
    import("@sanipatitas/ui/components/atoms/paws-animated").then((m) => ({
      default: m.PawsAnimated,
    }))
  ),
  lazy(() =>
    import("@sanipatitas/ui/components/atoms/pets-animated").then((m) => ({
      default: m.PetsAnimated,
    }))
  ),
] as const

// Component
export function DefaultLoadingPage() {
  const RandomAnimation = ANIMATIONS[randomAnimation()]!

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1 p-2">
      <ClientOnly fallback={<Fallback />}>
        <Suspense fallback={<Fallback />}>
          <RandomAnimation className="size-32 min-h-32 min-w-32" />
        </Suspense>
      </ClientOnly>
      Cargando...
    </div>
  )
}

// Helper
function randomAnimation() {
  return Math.floor(Math.random() * ANIMATIONS.length)
}

function Fallback() {
  return <div className="size-32 min-h-32 min-w-32" />
}
