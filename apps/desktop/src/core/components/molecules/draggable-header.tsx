import { cn } from "@sanipatitas/ui/lib/tailwind"

// Component
type DraggableHeaderProps = React.HTMLAttributes<HTMLDivElement>

export function DraggableHeader({ className, ...props }: DraggableHeaderProps) {
  return (
    <div
      data-tauri-drag-region
      className={cn("not-macos:hidden fixed z-100 h-8 w-dvw", className)}
      {...props}
    />
  )
}
