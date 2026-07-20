import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useClient } from "@sanipatitas/desktop/client/hook/use-client"
import { putApiClientByIdMutation } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import type { OpenapiClientDto } from "@sanipatitas/shared/api/client/types.gen"
import { zOpenapiUpdateClientRequest } from "@sanipatitas/shared/api/client/zod.gen"
import { ControlledCombobox } from "@sanipatitas/ui/components/form/controlled/controlled-combobox"
import { ControlledInput } from "@sanipatitas/ui/components/form/controlled/controlled-input"
import { ControlledTextarea } from "@sanipatitas/ui/components/form/controlled/controlled-textarea"
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
import { useMutation } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const ID_TYPE_OPTIONS = [
  { value: "DNI", label: "DNI" },
  { value: "CE", label: "Carné de Extranjería" },
  { value: "PASSPORT", label: "Pasaporte" },
]

interface UpdateClientProps {
  client: OpenapiClientDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateClient({
  client,
  open,
  onOpenChange,
}: UpdateClientProps) {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)

  const clientQuery = useClient()

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(zOpenapiUpdateClientRequest),
    defaultValues: {
      firstName: "",
      lastName: "",
      idType: "DNI" as const,
      idNumber: "",
      phone: "",
      phoneAlt: "",
      email: "",
      address: "",
      notes: "",
    },
  })

  useEffect(() => {
    if (client) {
      reset({
        firstName: client.firstName,
        lastName: client.lastName,
        idType: client.idType,
        idNumber: client.idNumber,
        phone: client.phone,
        phoneAlt: client.phoneAlt ?? "",
        email: client.email ?? "",
        address: client.address ?? "",
        notes: client.notes ?? "",
      })
    }
  }, [client, reset])

  const updateClientMutation = useMutation({
    ...putApiClientByIdMutation(),
    onSuccess: () => {
      dialogActionsRef.current?.close()
      clientQuery.refetch()
    },
    onError: (error) => {
      toast.error(
        (error as { detail?: string })?.detail ??
          "Error al actualizar el cliente"
      )
    },
  })

  const onSubmit = handleSubmit((data) => {
    if (!client) return

    updateClientMutation.mutate({
      path: { id: client.id },
      body: {
        ...data,
        phoneAlt: data.phoneAlt,
        email: data.email,
        address: data.address,
        notes: data.notes,
      },
    })
  })

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      actionsRef={dialogActionsRef}
    >
      <DialogContent render={<form onSubmit={onSubmit} />}>
        <DialogHeader>
          <DialogTitle>Editar cliente</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <ControlledInput control={control} name="firstName" label="Nombres" />
          <ControlledInput
            control={control}
            name="lastName"
            label="Apellidos"
          />

          <ControlledCombobox
            control={control}
            name="idType"
            label="Tipo de documento"
            options={ID_TYPE_OPTIONS}
          />

          <ControlledInput
            control={control}
            name="idNumber"
            label="N° de documento"
          />

          <ControlledInput control={control} name="phone" label="Teléfono" />
          <ControlledInput
            control={control}
            name="phoneAlt"
            label="Teléfono alternativo"
          />
          <ControlledInput
            control={control}
            name="email"
            label="Correo electrónico"
          />
          <ControlledInput control={control} name="address" label="Dirección" />
          <ControlledTextarea control={control} name="notes" label="Notas" />
        </FieldGroup>

        <DialogFooter>
          <DialogClose render={<Button variant="secondary">Cancelar</Button>} />
          <Button type="submit">Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
