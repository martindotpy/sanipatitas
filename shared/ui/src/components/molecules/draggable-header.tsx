import { cn } from "@sanipatitas/ui/lib/tailwind"

// Component
type DraggableHeaderProps = React.HTMLAttributes<HTMLDivElement>

export function DraggableHeader({ className, ...props }: DraggableHeaderProps) {
  return (
    <div
      data-tauri-drag-region
      className={cn("fixed h-8 w-dvw", className)}
      {...props}
    />
  )
}
