import { cn } from "@sanipatitas/ui/lib/tailwind"

// Component
export type BlockquoteProps = React.ComponentProps<"blockquote">

export function Blockquote({ className, ...props }: BlockquoteProps) {
  return (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    />
  )
}
