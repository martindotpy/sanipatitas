import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@sanipatitas/ui/components/ui/sheet"
import { Separator } from "@sanipatitas/ui/components/ui/separator"
import type { OpenapiSpeciesDto } from "@sanipatitas/shared/api/client/types.gen"

// Types
interface SpeciesDetailsSheetProps {
  species: OpenapiSpeciesDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Component
export function SpeciesDetailsSheet({
  species,
  open,
  onOpenChange,
}: SpeciesDetailsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" showCloseButton>
        <SheetHeader>
          <SheetTitle>{species?.name ?? "Detalles"}</SheetTitle>
        </SheetHeader>

        {species && (
          <div className="flex flex-col gap-4 px-4">
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs font-medium">ID</p>
              <p className="text-sm break-all">{species.id}</p>
            </div>

            <Separator />

            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs font-medium">Nombre</p>
              <p className="text-sm">{species.name}</p>
            </div>

            <Separator />

            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs font-medium">Descripción</p>
              <p className="text-sm">{species.description ?? "Sin descripción"}</p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
