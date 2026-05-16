import { ClientOnly } from "@tanstack/react-router"
import { lazy, useId } from "react"

// Animations
const ANIMATIONS = [
  lazy(() =>
    import("@sanipatitas/ui/components/atoms/ambulance-animated").then(
      (m) => ({ default: m.AmbulanceAnimated })
    )
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
    import("@sanipatitas/ui/components/atoms/injection-animated").then(
      (m) => ({ default: m.InjectionAnimated })
    )
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

const hashCode = (str: string): number => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

// Component
export function DefaultLoadingPage() {
  const RandomAnimation = ANIMATIONS[hashCode(useId()) % ANIMATIONS.length]!

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1 p-2">
      <ClientOnly fallback={<div className="min-h-32 min-w-32 size-32" />}>
        <RandomAnimation className="min-h-32 min-w-32 size-32" />
      </ClientOnly>
      Cargando...
    </div>
  )
}
