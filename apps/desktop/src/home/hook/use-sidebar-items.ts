import { useIsAdmin } from "@sanipatitas/desktop/auth/hook/use-role"
import type { LinkRoute } from "@sanipatitas/desktop/pages/_app/routes/-routes-types"
import type { IconType } from "react-icons/lib"
import {
  TbApi,
  TbCalendar,
  TbCategory2,
  TbLayoutDashboard,
  TbLockAccess,
  TbPaw,
  TbReportMoney,
  TbShoppingBag,
  TbUserCircle,
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
        icon: TbUserCircle,
      },
      {
        to: "/breed",
        label: "Razas",
        icon: TbCategory2,
      },
    ],

    Ventas: [
      {
        to: "/inventory",
        label: "Inventario",
        icon: TbShoppingBag,
      },
      {
        to: "/billing",
        label: "Facturación",
        icon: TbReportMoney,
      },
    ],

    Administración: [
      ...(isAdmin
        ? [
            {
              to: "/admin/users",
              label: "Usuarios",
              icon: TbLockAccess,
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
