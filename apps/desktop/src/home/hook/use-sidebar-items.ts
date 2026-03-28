import type { IconType } from "react-icons/lib"

// Hook
interface SidebarItem {
  to: string
  label: string
  icon: IconType
}

export function useSidebarItems(): SidebarItem[] {
  return []
}
