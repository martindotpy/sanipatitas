// Component
export function FallbackDraggableHeader() {
  return (
    <div
      data-tauri-drag-region
      data-draggable-fallback="true"
      className="h-header-h fixed z-98 w-dvw data-[draggable-fallback=false]:hidden"
    />
  )
}
