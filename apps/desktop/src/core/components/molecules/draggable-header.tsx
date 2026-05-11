import { os } from "@sanipatitas/desktop/core/configuration/app-configuration"
import { cn } from "@sanipatitas/ui/lib/tailwind"
import { WindowTitlebar } from "@tauri-controls-v2/react"

// Component
type DraggableHeaderProps = React.HTMLAttributes<HTMLDivElement>

export function DraggableHeader({ className, ...props }: DraggableHeaderProps) {
  if (os === "macos")
    return (
      <div
        data-tauri-drag-region
        className={cn("fixed h-8 w-dvw", className)}
        {...props}
      />
    )

  return (
    <div className="fixed w-full **:bg-transparent!">
      <WindowTitlebar className={className} {...props} />
    </div>
  )
}
