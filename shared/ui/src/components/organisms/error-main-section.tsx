import { Section } from "@sanipatitas/ui/components/organisms/section"
import { Link } from "@sanipatitas/ui/components/ui/link"

// Component
export function ErrorMainSection() {
  return (
    <Section className="mx-auto flex max-w-xs flex-1 flex-col items-center justify-center gap-4 px-5 py-8">
      <h1 className="mb-2 text-5xl font-semibold">¡Ups!</h1>

      <p className="text-muted-foreground text-pretty">
        Parece que ha ocurrido un error inesperado. Por favor, intenta recargar
        la página.
      </p>

      <Link variant="default" className="w-full">
        Volver al inicio
      </Link>
    </Section>
  )
}
