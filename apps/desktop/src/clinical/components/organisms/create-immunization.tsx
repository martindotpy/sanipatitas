import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@sanipatitas/desktop/auth/client/auth-client"
import { useCreateImmunization } from "@sanipatitas/desktop/clinical/hook/use-immunization"
import type {
  OpenapiImmunizationRoute,
  OpenapiImmunizationStatus,
} from "@sanipatitas/shared/api/client/types.gen"
import { zOpenapiCreateImmunizationRequest } from "@sanipatitas/shared/api/client/zod.gen"
import { ControlledCombobox } from "@sanipatitas/ui/components/form/controlled/controlled-combobox"
import { ControlledDatetimeInput } from "@sanipatitas/ui/components/form/controlled/controlled-datetime-input"
import { ControlledInput } from "@sanipatitas/ui/components/form/controlled/controlled-input"
import { Button } from "@sanipatitas/ui/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@sanipatitas/ui/components/ui/dialog"
import { FieldGroup } from "@sanipatitas/ui/components/ui/field"
import { useQuery } from "@tanstack/react-query"
import { useMemo, useRef } from "react"
import { useForm } from "react-hook-form"
import { TbPlus } from "react-icons/tb"
import { toast } from "sonner"

// Options
const ROUTE_OPTIONS = [
  { value: "SUBCUTANEOUS", label: "Subcutánea" },
  { value: "INTRAMUSCULAR", label: "Intramuscular" },
  { value: "ORAL", label: "Oral" },
  { value: "INTRADERMAL", label: "Intradérmica" },
  { value: "TOPICAL", label: "Tópica" },
]

const STATUS_OPTIONS = [
  { value: "COMPLETED", label: "Completada" },
  { value: "ENTERED_IN_ERROR", label: "Ingresada por error" },
  { value: "NOT_DONE", label: "No realizada" },
]

// Props
interface CreateImmunizationProps {
  patientId: string
}

// Component
export function CreateImmunization({ patientId }: CreateImmunizationProps) {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)
  const createMutation = useCreateImmunization()

  const usersQuery = useQuery({
    queryKey: ["auth-users"],
    queryFn: async () => {
      const result = await authClient.admin.listUsers({
        query: { limit: 100 },
        fetchOptions: { throw: true },
      })
      return result
    },
  })

  const userOptions = useMemo(
    () =>
      (usersQuery.data?.users ?? []).map(
        (u: { id: string; name: string; lastName?: string }) => ({
          value: u.id,
          label: `${u.name} ${u.lastName ?? ""}`,
        })
      ),
    [usersQuery.data]
  )

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(zOpenapiCreateImmunizationRequest),
    defaultValues: {
      vaccineCode: "",
      vaccineName: "",
      manufacturer: "",
      lotNumber: "",
      expirationDate: "",
      administrationDate: "",
      doseNumber: "",
      doseUnit: "",
      route: "",
      site: "",
      reaction: "",
      status: "",
      patientId,
      veterinarianId: "",
    },
  })

  const onSubmit = handleSubmit((data) => {
    createMutation.mutate(
      {
        vaccineCode: data.vaccineCode,
        vaccineName: data.vaccineName,
        manufacturer: data.manufacturer,
        lotNumber: data.lotNumber,
        expirationDate: data.expirationDate,
        administrationDate: data.administrationDate,
        doseNumber: data.doseNumber,
        doseUnit: data.doseUnit,
        route: data.route as OpenapiImmunizationRoute,
        site: data.site,
        reaction: data.reaction,
        status: data.status as OpenapiImmunizationStatus,
        patientId,
        veterinarianId: data.veterinarianId,
      },
      {
        onSuccess: () => {
          dialogActionsRef.current?.close()
          reset()
        },
        onError: (error) => {
          toast.error(
            (error as { detail?: string })?.detail ??
              "Error al crear la inmunización"
          )
        },
      }
    )
  })

  return (
    <Dialog actionsRef={dialogActionsRef}>
      <DialogTrigger
        render={
          <Button variant="secondary" size="sm">
            <TbPlus className="size-4" />
            Agregar
          </Button>
        }
      />

      <DialogContent render={<form onSubmit={onSubmit} />}>
        <DialogHeader>
          <DialogTitle>Crear inmunización</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <ControlledInput
            control={control}
            name="vaccineCode"
            label="Código de vacuna"
          />

          <ControlledInput
            control={control}
            name="vaccineName"
            label="Nombre de vacuna"
          />

          <ControlledInput
            control={control}
            name="manufacturer"
            label="Fabricante"
          />

          <ControlledInput
            control={control}
            name="lotNumber"
            label="Número de lote"
          />

          <ControlledDatetimeInput
            control={control}
            name="expirationDate"
            mode="date"
            label="Fecha de vencimiento"
          />

          <ControlledDatetimeInput
            control={control}
            name="administrationDate"
            mode="date"
            label="Fecha de administración"
          />

          <ControlledInput
            control={control}
            name="doseNumber"
            label="Número de dosis"
          />

          <ControlledInput
            control={control}
            name="doseUnit"
            label="Unidad de dosis"
          />

          <ControlledCombobox
            control={control}
            name="route"
            label="Vía"
            options={ROUTE_OPTIONS}
            placeholder="Seleccionar vía..."
          />

          <ControlledInput
            control={control}
            name="site"
            label="Sitio de aplicación"
          />

          <ControlledInput control={control} name="reaction" label="Reacción" />

          <ControlledCombobox
            control={control}
            name="status"
            label="Estado"
            options={STATUS_OPTIONS}
            placeholder="Seleccionar estado..."
          />

          <ControlledCombobox
            control={control}
            name="veterinarianId"
            label="Veterinario"
            options={userOptions}
            placeholder="Seleccionar veterinario..."
            searchPlaceholder="Buscar veterinario..."
          />
        </FieldGroup>

        <DialogFooter>
          <DialogClose render={<Button variant="secondary">Cancelar</Button>} />
          <Button type="submit">Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
