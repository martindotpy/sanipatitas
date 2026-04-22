import { os } from "@sanipatitas/desktop/core/configuration/app-configuration"
import { WindowTitlebar } from "@tauri-controls-v2/react"

// Component
type DraggableHeaderProps = React.HTMLAttributes<HTMLDivElement>

export function DraggableHeader({ className, ...props }: DraggableHeaderProps) {
  if (os === "macos")
    return <div data-tauri-drag-region className="fixed h-8 w-dvw" {...props} />

  return <WindowTitlebar {...props} />
}
