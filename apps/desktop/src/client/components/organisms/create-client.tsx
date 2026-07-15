import { type DialogRoot } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useClient } from "@sanipatitas/desktop/client/hook/use-client"
import { postApiClientMutation } from "@sanipatitas/shared/api/client/@tanstack/react-query.gen"
import { zOpenapiCreateClientRequest } from "@sanipatitas/shared/api/client/zod.gen"
import { uuidV7 } from "@sanipatitas/shared/lib/uuid"
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
  DialogTrigger,
} from "@sanipatitas/ui/components/ui/dialog"
import { FieldGroup } from "@sanipatitas/ui/components/ui/field"
import { useMutation } from "@tanstack/react-query"
import { useMemo, useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { TbPlus } from "react-icons/tb"

const ID_TYPE_OPTIONS = [
  { value: "DNI", label: "DNI" },
  { value: "CE", label: "Carné de Extranjería" },
  { value: "PASSPORT", label: "Pasaporte" },
]

export function CreateClient() {
  const dialogActionsRef = useRef<DialogRoot.Actions | null>(null)

  const clientQuery = useClient()

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(zOpenapiCreateClientRequest),
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

  const createClientMutation = useMutation({
    ...postApiClientMutation(),
    onSuccess: () => {
      dialogActionsRef.current?.close()
      clientQuery.refetch()
      reset()
    },
    onError: (error) => {
      toast.error((error as { detail?: string })?.detail ?? "Error al crear el cliente")
    },
  })

  const onSubmit = handleSubmit((data) => {
    createClientMutation.mutate({
      body: {
        id: uuidV7(),
        ...data,
        phoneAlt: data.phoneAlt || undefined,
        email: data.email || undefined,
        address: data.address || undefined,
        notes: data.notes || undefined,
      },
    })
  })

  return (
    <Dialog actionsRef={dialogActionsRef}>
      <DialogTrigger
        render={
          <Button variant="secondary">
            <TbPlus />
          </Button>
        }
      />

      <DialogContent render={<form onSubmit={onSubmit} />}>
        <DialogHeader>
          <DialogTitle>Crear cliente</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <ControlledInput control={control} name="firstName" label="Nombres" />
          <ControlledInput control={control} name="lastName" label="Apellidos" />

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
          <Button type="submit">Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
