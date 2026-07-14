import { useIsAdmin } from "@sanipatitas/desktop/auth/hook/use-role"
import type { LinkRoute } from "@sanipatitas/desktop/pages/_app/routes/-routes-types"
import type { IconType } from "react-icons/lib"
import {
  TbApi,
  TbCalendar,
  TbCategory2,
  TbLayoutDashboard,
  TbPaw,
  TbUserCircle,
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
      {
        to: "/profile",
        label: "Mi Perfil",
        icon: TbUserCircle,
      },
    ],
    Pacientes: [
      {
        to: "/appointment",
        label: "Calendario",
        icon: TbCalendar,
      },
      {
        to: "/patient",
        label: "Pacientes",
        icon: TbPaw,
      },
      {
        to: "/client",
        label: "Clientes",
        icon: TbUsers,
      },
      {
        to: "/breed",
        label: "Razas",
        icon: TbCategory2,
      },
    ],

    Administración: [
      ...(isAdmin
        ? [
            {
              to: "/admin/users" as const,
              label: "Usuarios",
              icon: TbUsers,
            },
          ]
        : []),
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
