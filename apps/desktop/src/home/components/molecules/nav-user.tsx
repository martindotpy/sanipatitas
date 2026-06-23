import { authClient } from "@sanipatitas/desktop/auth/client/auth-client"
import { displayRole } from "@sanipatitas/desktop/auth/display/display-role"
import { useUser } from "@sanipatitas/desktop/auth/hook/use-user"
import { invalidateSessionQuery } from "@sanipatitas/desktop/auth/query/session-query"
import { useClearHistory } from "@sanipatitas/desktop/core/hook/use-clear-history"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@sanipatitas/ui/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@sanipatitas/ui/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@sanipatitas/ui/components/ui/sidebar"
import { Link, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { TbLogout, TbUserCircle } from "react-icons/tb"
import { toast } from "sonner"

// Component
export function NavUser() {
  // Navigate
  const navigate = useNavigate()

  // Clear history
  const clearHistory = useClearHistory()

  // User
  const user = useUser()

  // Sign out
  const [isSigningOut, setIsSigningOut] = useState(false)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground min-h-12 group-data-[collapsible=icon]:bg-transparent! hover:cursor-pointer"
              >
                <Avatar>
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />
                  <AvatarFallback>
                    {user.name[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user.name} {user.lastName}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {displayRole(user.role!)}
                  </span>
                </div>
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent className="min-w-44">
            <DropdownMenuGroup>
              <DropdownMenuItem
                render={
                  <Link to="/profile">
                    <TbUserCircle />
                    Perfil
                  </Link>
                }
              />
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={async () => {
                  setIsSigningOut(true)

                  await toast
                    .promise(
                      authClient.signOut().then(() => invalidateSessionQuery()),
                      {
                        loading: "Cerrando sesión...",
                        success: async () => {
                          await navigate({ to: "/sign-in", replace: true })
                          clearHistory()

                          return `¡Hasta luego, ${user.name}!`
                        },
                        error: "Error al cerrar sesión, intenta nuevamente.",
                      }
                    )
                    .unwrap()
                    .finally(() => setIsSigningOut(false))
                }}
                disabled={isSigningOut}
              >
                <TbLogout />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
