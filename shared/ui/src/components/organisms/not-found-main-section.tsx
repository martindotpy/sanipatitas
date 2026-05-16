import { Section } from "@sanipatitas/ui/components/organisms/section"
import { buttonVariants } from "@sanipatitas/ui/components/ui/button"
import { Link } from "@sanipatitas/ui/components/ui/link"
import { cn } from "@sanipatitas/ui/lib/tailwind"

// Component
export function NotFoundMainSection() {
  return (
    <Section className="mx-auto flex max-w-xs flex-1 flex-col items-center justify-center gap-4 px-5 py-8">
      <h1 className="mb-2 text-5xl font-semibold">¡Ups!</h1>

      <p className="text-muted-foreground text-pretty">
        La página que buscas no existe o ha sido movida. Por favor, verifica la
        URL e inténtalo de nuevo.
      </p>

      <div className="flex w-full flex-col gap-2">
        <Link variant="default" className="w-full">
          Volver al inicio
        </Link>
        <a
          href="/docs"
          className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
        >
          Documentación
        </a>
      </div>
    </Section>
  )
}
