import type { OpenapiBreedDto } from "@sanipatitas/shared/api/client/types.gen"
import { Separator } from "@sanipatitas/ui/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@sanipatitas/ui/components/ui/sheet"

interface BreedDetailsSheetProps {
  breed: OpenapiBreedDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BreedDetailsSheet({
  breed,
  open,
  onOpenChange,
}: BreedDetailsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton
        className="max-h-main-h mt-header-h"
      >
        <SheetHeader>
          <SheetTitle>{breed?.name ?? "Detalles"}</SheetTitle>
        </SheetHeader>

        {breed && (
          <div className="flex flex-col gap-4 px-4">
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs font-medium">ID</p>
              <p className="text-sm break-all">{breed.id}</p>
            </div>

            <Separator />

            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs font-medium">
                Especie
              </p>
              <p className="text-sm">{breed.species.name}</p>
            </div>

            <Separator />

            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs font-medium">
                Nombre
              </p>
              <p className="text-sm">{breed.name}</p>
            </div>

            <Separator />

            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs font-medium">
                Descripción
              </p>
              <p className="text-sm">
                {breed.description ?? "Sin descripción"}
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
