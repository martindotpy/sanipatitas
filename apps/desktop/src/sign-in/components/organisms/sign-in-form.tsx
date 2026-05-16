import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@sanipatitas/desktop/auth/client/auth-client"
import { Favicon } from "@sanipatitas/desktop/core/components/atoms/favicon"
import { zOpenapiSignInEmailBody } from "@sanipatitas/shared/api/client/zod.gen"
import { ControlledInput } from "@sanipatitas/ui/components/form/controlled/controlled-input"
import { ControlledPasswordInput } from "@sanipatitas/ui/components/form/controlled/controlled-password-input"
import { Button } from "@sanipatitas/ui/components/ui/button"
import {
  FieldDescription,
  FieldGroup,
} from "@sanipatitas/ui/components/ui/field"
import { useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { TbLoader2 } from "react-icons/tb"
import { z } from "zod"

// Schema
const SignInEmailBody = zOpenapiSignInEmailBody.safeExtend({
  email: z.email(),
  password: z.string().min(6),
})

// Component
export function SignInForm() {
  // Navigate
  const navigate = useNavigate()

  // Form
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(SignInEmailBody),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    await toast
      .promise(
        authClient.signIn.email(
          { email: data.email, password: data.password },
          { throw: true }
        ),
        {
          loading: "Ingresando...",
          success: ({ user }) => {
            navigate({ to: "/home" })

            return `¡Bienvenido de nuevo, ${user.name}!`
          },
          error:
            "Error al ingresar, verifica tus credenciales e intenta nuevamente.",
        }
      )
      .unwrap()
  })

  return (
    <div className="flex max-w-md flex-1 flex-col justify-center gap-6">
      <form onSubmit={onSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-24 items-center justify-center rounded-md">
              <Favicon className="size-18" />
            </div>
            <span className="sr-only">Sanipatitas</span>

            <h1 className="text-xl font-bold">Bienvenido a Sanipatitas</h1>

            <FieldDescription>
              ¿Has olvidado tu contraseña?{" "}
              <a href="#">Recupera tu contraseña</a>
            </FieldDescription>
          </div>

          <div className="space-y-3">
            <ControlledInput
              name="email"
              control={control}
              label="Correo"
              inputProps={{
                placeholder: "yo@email.com",
                autoComplete: "email",
              }}
            />
            <ControlledPasswordInput
              name="password"
              control={control}
              label="Contraseña"
              inputProps={{
                placeholder: "Contraseña",
              }}
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <TbLoader2 className="size-4 animate-spin" />
                Ingresando...
              </>
            ) : (
              "Ingresar"
            )}
          </Button>
        </FieldGroup>
      </form>

      <FieldDescription className="px-6 text-center">
        Al hacer clic en Ingresar, aceptas nuestros{" "}
        <a href="#">Términos de servicio</a> y la{" "}
        <a href="#">Política de privacidad</a>.
      </FieldDescription>
    </div>
  )
}
