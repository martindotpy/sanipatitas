import type { OpenapiClientDto } from "@sanipatitas/shared/api/client/types.gen"
import { Separator } from "@sanipatitas/ui/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@sanipatitas/ui/components/ui/sheet"

interface ClientDetailsSheetProps {
  client: OpenapiClientDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClientDetailsSheet({
  client,
  open,
  onOpenChange,
}: ClientDetailsSheetProps) {
  const fullName = client
    ? `${client.firstName} ${client.lastName}`
    : "Detalles"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton
        className="max-h-main-h mt-header-h overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>{fullName}</SheetTitle>
        </SheetHeader>

        {client && (
          <div className="flex flex-col gap-4 px-4">
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs font-medium">
                Identificador
              </p>
              <p className="text-sm break-all">{client.id}</p>
            </div>

            <Separator />

            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs font-medium">
                Nombre
              </p>
              <p className="text-sm">
                {client.firstName} {client.lastName}
              </p>
            </div>

            <Separator />

            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs font-medium">
                Tipo de documento
              </p>
              <p className="text-sm">{client.idType}</p>
            </div>

            <Separator />

            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs font-medium">
                N° de documento
              </p>
              <p className="text-sm">{client.idNumber}</p>
            </div>

            <Separator />

            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs font-medium">
                Teléfono
              </p>
              <p className="text-sm">{client.phone}</p>
            </div>

            {client.phoneAlt && (
              <>
                <Separator />
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-xs font-medium">
                    Teléfono alternativo
                  </p>
                  <p className="text-sm">{client.phoneAlt}</p>
                </div>
              </>
            )}

            {client.email && (
              <>
                <Separator />
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-xs font-medium">
                    Correo electrónico
                  </p>
                  <p className="text-sm">{client.email}</p>
                </div>
              </>
            )}

            {client.address && (
              <>
                <Separator />
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-xs font-medium">
                    Dirección
                  </p>
                  <p className="text-sm">{client.address}</p>
                </div>
              </>
            )}

            {client.notes && (
              <>
                <Separator />
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-xs font-medium">
                    Notas
                  </p>
                  <p className="text-sm">{client.notes}</p>
                </div>
              </>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
