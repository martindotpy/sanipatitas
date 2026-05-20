import { useIsSidebarActive } from "@sanipatitas/desktop/home/hook/use-is-sidebar-active"
import { Button } from "@sanipatitas/ui/components/ui/button"
import { SidebarTrigger } from "@sanipatitas/ui/components/ui/sidebar"
import { $ } from "@sanipatitas/ui/lib/dom-selector"
import { useCanGoBack, useRouter, useRouterState } from "@tanstack/react-router"
import { useEffect } from "react"
import { TbChevronLeft, TbChevronRight } from "react-icons/tb"

// Component
export function DraggableHeader() {
  // Router
  const router = useRouter()

  // History state
  const canGoBack = useCanGoBack()
  const canGoForward = useRouterState({
    select: (s) => s.location.state.__TSR_index < router.history.length - 1,
  })

  // Sidebar
  const isSidebarActive = useIsSidebarActive()

  // Remove fallback
  useEffect(() => {
    const $fallback = $<HTMLDivElement>("[data-draggable-fallback]")

    if ($fallback) {
      $fallback.dataset.draggableFallback = "false"
    }

    return () => {
      if ($fallback) {
        $fallback.dataset.draggableFallback = "true"
      }
    }
  }, [])

  return (
    <>
      <div className="macos:pl-18 fixed top-0 left-0 z-99 flex w-fit">
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
      </div>

      <div
        id="draggable-header"
        data-tauri-drag-region
        className="h-header-h fixed z-98 w-full"
      />
    </>
  )
}
