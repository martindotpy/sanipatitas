import type { IconType } from "react-icons/lib"
import { TbLayout } from "react-icons/tb"

// Hook
interface SidebarItem {
  to: string
  label: string
  icon: IconType
}

export function useSidebarItems(): SidebarItem[] {
  return [
    {
      to: "/",
      label: "Inicio",
      icon: TbLayout,
    },
  ]
}
