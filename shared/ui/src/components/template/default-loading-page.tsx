import { AmbulanceAnimated } from "@sanipatitas/ui/components/atoms/ambulance-animated"
import { CatAnimated } from "@sanipatitas/ui/components/atoms/cat-animated"
import { DuckAnimated } from "@sanipatitas/ui/components/atoms/duck-animated"
import { HeartBeatAnimated } from "@sanipatitas/ui/components/atoms/heart-beat-animated"
import { InjectionAnimated } from "@sanipatitas/ui/components/atoms/injection-animated"
import { ManekiCatAnimated } from "@sanipatitas/ui/components/atoms/maneki-cat-animated"
import { PawsAnimated } from "@sanipatitas/ui/components/atoms/paws-animated"
import { PetsAnimated } from "@sanipatitas/ui/components/atoms/pets-animated"
import { ClientOnly } from "@tanstack/react-router"

// Animations
const ANIMATIONS = [
  AmbulanceAnimated,
  CatAnimated,
  DuckAnimated,
  HeartBeatAnimated,
  InjectionAnimated,
  ManekiCatAnimated,
  PawsAnimated,
  PetsAnimated,
] as const

// Component
export function DefaultLoadingPage() {
  const RandomAnimation = ANIMATIONS[randomAnimation()]!

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1 p-2">
      <ClientOnly fallback={<Fallback />}>
        <RandomAnimation className="size-32 min-h-32 min-w-32" />
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
