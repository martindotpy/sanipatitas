import { TbLoader2 } from "react-icons/tb"

// Component
export function DefaultLoadingPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-2">
      <TbLoader2 className="size-14 animate-spin" />
      Cargando...
    </div>
  )
}
