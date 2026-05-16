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
    <div className={cn("fixed z-99 flex h-8 w-dvw", className)} {...props}>
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
      {isSidebarActive && <SidebarTrigger />}
      <div className="windows:[app-region:drag] macos:[app-region:drag] h-full flex-1" />
    </div>
  )
}
