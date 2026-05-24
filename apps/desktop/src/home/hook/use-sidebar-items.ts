import { useIsAdmin } from "@sanipatitas/desktop/auth/hook/use-role"
import type { LinkRoute } from "@sanipatitas/desktop/pages/_app/routes/-routes-types"
import type { IconType } from "react-icons/lib"
import {
  TbApi,
  TbCategory2,
  TbLayoutDashboard,
  TbPaw,
  TbUsers,
} from "react-icons/tb"

// Hook
interface SidebarItem {
  to: LinkRoute | (string & {})
  label: string
  icon: IconType
  external?: boolean
}

type SidebarGroups = Record<string, SidebarItem[]>

export function useSidebarItems(): SidebarGroups {
  const isAdmin = useIsAdmin()

  return {
    "": [
      {
        to: "/",
        label: "Dashboard",
        icon: TbLayoutDashboard,
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
        icon: TbCategory2,
      },
    ],

    ...(isAdmin && {
      Desarrollo: [
        {
          to: "/docs",
          label: "Documentación OpenAPI",
          icon: TbApi,
          external: true,
        },
      ],
    }),
  }
}
