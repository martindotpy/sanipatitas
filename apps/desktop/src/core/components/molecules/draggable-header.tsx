import { useIsSidebarActive } from "@sanipatitas/desktop/home/hook/use-is-sidebar-active"
import { Button } from "@sanipatitas/ui/components/ui/button"
import { SidebarTrigger } from "@sanipatitas/ui/components/ui/sidebar"
import { cn } from "@sanipatitas/ui/lib/tailwind"
import { useCanGoBack, useRouter, useRouterState } from "@tanstack/react-router"
import { TbChevronLeft, TbChevronRight } from "react-icons/tb"

// Component
type DraggableHeaderProps = React.HTMLAttributes<HTMLDivElement>

export function DraggableHeader({ className, ...props }: DraggableHeaderProps) {
  // Router
  const router = useRouter()

  // History state
  const canGoBack = useCanGoBack()
  const canGoForward = useRouterState({
    select: (s) => s.location.state.__TSR_index < router.history.length - 1,
  })

  // Sidebar
  const isSidebarActive = useIsSidebarActive()

  return (
    <div className={cn("fixed z-99 flex h-header-h w-dvw", className)} {...props}>
      <div
        id="draggable-header"
        className="macos:pl-18 flex h-full items-center"
      >
        <Button
          size="icon-sm"
          variant="ghost"
          disabled={!canGoBack}
          onClick={() => router.history.back()}
        >
          <TbChevronLeft className="size-4" />
        </Button>
        <Button
          size="icon-sm"
          variant="ghost"
          disabled={!canGoForward}
          onClick={() => router.history.forward()}
        >
          <TbChevronRight className="size-4" />
        </Button>
      </div>

      {isSidebarActive && <SidebarTrigger />}
      <div data-tauri-drag-region className="h-full flex-1" />
    </div>
  )
}
