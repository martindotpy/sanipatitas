import { cn } from "@sanipatitas/ui/lib/tailwind"

// Component
type H1Props = React.ComponentProps<"h1">

export function H1({ className, ...props }: H1Props) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
        className
      )}
      {...props}
    />
  )
}
