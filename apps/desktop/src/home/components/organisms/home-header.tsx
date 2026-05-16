import { SidebarTrigger } from "@sanipatitas/ui/components/ui/sidebar"

// Component
export function HomeHeader() {
  return (
    <header className="bg-sidebar h-header-h macos:pl-20 flex shrink-0 items-center gap-2 transition-[width,height] ease-linear">
      <SidebarTrigger />
    </header>
  )
}
