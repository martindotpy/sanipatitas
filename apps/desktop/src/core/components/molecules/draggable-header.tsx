import { os } from "@sanipatitas/desktop/core/configuration/app-configuration"
import { cn } from "@sanipatitas/ui/lib/tailwind"
import { WindowTitlebar } from "@tauri-controls-v2/react"

// Component
type DraggableHeaderProps = React.HTMLAttributes<HTMLDivElement>

function MacosDraggableHeader({ className, ...props }: DraggableHeaderProps) {
  return (
    <div
      data-tauri-drag-region
      className={cn("not-macos:hidden fixed z-100 h-8 w-dvw", className)}
      {...props}
    />
  )
}

export function DraggableHeader({ className, ...props }: DraggableHeaderProps) {
  if (os === "macos") {
    return <MacosDraggableHeader className={className} {...props} />
  }

  return (
    <>
      <div className="macos:hidden fixed z-100 w-full **:bg-transparent!">
        <WindowTitlebar className={cn(className, "**:z-110")} {...props} />
      </div>

      <MacosDraggableHeader className={className} {...props} />
    </>
  )
}
