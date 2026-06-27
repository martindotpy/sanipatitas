import type { OpenapiAppointmentDto } from "@sanipatitas/shared/api/client/types.gen"
import { Badge } from "@sanipatitas/ui/components/ui/badge"
import { Separator } from "@sanipatitas/ui/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@sanipatitas/ui/components/ui/sheet"
import { Button } from "@sanipatitas/ui/components/ui/button"
import { TbEdit, TbTrash } from "react-icons/tb"

// Labels
const STATUS_LABELS: Record<string, string> = {
  SCHEDULED: "Programada",
  IN_PROGRESS: "En curso",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
  NO_SHOW: "No asistió",
}

const CLASS_LABELS: Record<string, string> = {
  AMBULATORY: "Ambulatorio",
  EMERGENCY: "Emergencia",
  HOME_VISIT: "Visita domiciliaria",
}

const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-800",
  NO_SHOW: "bg-red-100 text-red-800",
}

// Props
interface AppointmentDetailsSheetProps {
  appointment: OpenapiAppointmentDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (appointment: OpenapiAppointmentDto) => void
  onDelete?: (appointment: OpenapiAppointmentDto) => void
}

export function AppointmentDetailsSheet({
  appointment,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: AppointmentDetailsSheetProps) {
  if (!appointment) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton
        className="max-h-main-h mt-header-h overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>
            {appointment.patient.name}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4">
          <div className="flex items-center gap-2">
            <Badge
              className={STATUS_COLORS[appointment.status]}
              variant="secondary"
            >
              {STATUS_LABELS[appointment.status] ?? appointment.status}
            </Badge>
            <Badge variant="outline">
              {CLASS_LABELS[appointment.appointmentClass] ??
                appointment.appointmentClass}
            </Badge>
          </div>

          <Separator />

          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-xs font-medium">Fecha</p>
            <p className="text-sm">{appointment.date}</p>
          </div>

          <Separator />

          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-xs font-medium">Horario</p>
            <p className="text-sm">
              {appointment.startTime}
              {appointment.endTime ? ` - ${appointment.endTime}` : ""}
            </p>
          </div>

          <Separator />

          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-xs font-medium">Paciente</p>
            <p className="text-sm">{appointment.patient.name}</p>
          </div>

          <Separator />

          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-xs font-medium">Dueño</p>
            <p className="text-sm">
              {appointment.client.firstName} {appointment.client.lastName}
              <span className="text-muted-foreground">
                {" "}
                ({appointment.client.idNumber})
              </span>
            </p>
          </div>

          <Separator />

          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-xs font-medium">
              Veterinario
            </p>
            <p className="text-sm">
              {appointment.veterinarian.name ??
                appointment.veterinarian.email}
            </p>
          </div>

          {appointment.reason && (
            <>
              <Separator />
              <div className="flex flex-col gap-1">
                <p className="text-muted-foreground text-xs font-medium">
                  Motivo
                </p>
                <p className="text-sm whitespace-pre-wrap">
                  {appointment.reason}
                </p>
              </div>
            </>
          )}

          {appointment.notes && (
            <>
              <Separator />
              <div className="flex flex-col gap-1">
                <p className="text-muted-foreground text-xs font-medium">
                  Notas
                </p>
                <p className="text-sm whitespace-pre-wrap">
                  {appointment.notes}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-auto flex gap-2 border-t px-4 py-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onEdit?.(appointment)}
          >
            <TbEdit />
            Editar
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => onDelete?.(appointment)}
          >
            <TbTrash />
            Eliminar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
