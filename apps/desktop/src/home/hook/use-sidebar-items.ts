import type { LinkRoute } from "@sanipatitas/desktop/pages/_app/routes/-routes-types"
import type { IconType } from "react-icons/lib"
import { TbAbc, TbLayout, TbPaw, TbUsers } from "react-icons/tb"

// Hook
interface SidebarItem {
  to: LinkRoute
  label: string
  icon: IconType
}

type SidebarGroups = Record<string, SidebarItem[]>

export function useSidebarItems(): SidebarGroups {
  return {
    "": [
      {
        to: "/",
        label: "Dashboard",
        icon: TbLayout,
      },
    ],
    Pacientes: [
      {
        to: "/patients",
        label: "Pacientes",
        icon: TbPaw,
      },
      {
        to: "/clients",
        label: "Clientes",
        icon: TbUsers,
      },
      {
        to: "/breeds",
        label: "Razas",
        icon: TbAbc,
      },
    ],
  }
}
