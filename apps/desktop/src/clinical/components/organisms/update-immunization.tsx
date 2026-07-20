import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@sanipatitas/desktop/auth/client/auth-client"
import type {
  ImmunizationDto,
  OpenapiImmunizationRoute,
  OpenapiImmunizationStatus,
} from "@sanipatitas/desktop/clinical/api/clinical-api"
import { useUpdateImmunization } from "@sanipatitas/desktop/clinical/hook/use-immunization"
import { zOpenapiUpdateImmunizationRequest } from "@sanipatitas/shared/api/client/zod.gen"
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
} from "@sanipatitas/ui/components/ui/dialog"
import { FieldGroup } from "@sanipatitas/ui/components/ui/field"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useRef } from "react"
import { useForm } from "react-hook-form"
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
interface UpdateImmunizationProps {
  immunization: ImmunizationDto | null
  patientId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Component
export function UpdateImmunization({
  immunization,
  patientId,
  open,
  onOpenChange,
}: UpdateImmunizationProps) {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)
  const updateMutation = useUpdateImmunization()

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
    resolver: zodResolver(zOpenapiUpdateImmunizationRequest),
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
      patientId: "",
      veterinarianId: "",
    },
  })

  useEffect(() => {
    if (immunization) {
      reset({
        vaccineCode: immunization.vaccineCode,
        vaccineName: immunization.vaccineName,
        manufacturer: immunization.manufacturer ?? "",
        lotNumber: immunization.lotNumber ?? "",
        expirationDate: immunization.expirationDate ?? "",
        administrationDate: immunization.administrationDate,
        doseNumber: immunization.doseNumber ?? "",
        doseUnit: immunization.doseUnit ?? "",
        route: immunization.route ?? "",
        site: immunization.site ?? "",
        reaction: immunization.reaction ?? "",
        status: immunization.status ?? "",
        veterinarianId: immunization.veterinarian?.id ?? "",
      })
    }
  }, [immunization, reset])

  const onSubmit = handleSubmit((data) => {
    if (!immunization) return

    updateMutation.mutate(
      {
        id: immunization.id,
        ...data,
        vaccineCode: data.vaccineCode,
        vaccineName: data.vaccineName!,
        manufacturer: data.manufacturer,
        lotNumber: data.lotNumber,
        expirationDate: data.expirationDate,
        administrationDate: data.administrationDate!,
        doseNumber: data.doseNumber,
        doseUnit: data.doseUnit,
        route: data.route as OpenapiImmunizationRoute,
        site: data.site,
        reaction: data.reaction,
        status: data.status as OpenapiImmunizationStatus,
        veterinarianId: data.veterinarianId!,
        patientId,
      },
      {
        onSuccess: () => {
          dialogActionsRef.current?.close()
        },
        onError: (error) => {
          toast.error(
            (error as { detail?: string })?.detail ??
              "Error al actualizar la inmunización"
          )
        },
      }
    )
  })

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      actionsRef={dialogActionsRef}
    >
      <DialogContent render={<form onSubmit={onSubmit} />}>
        <DialogHeader>
          <DialogTitle>Editar inmunización</DialogTitle>
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
          <Button type="submit">Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
