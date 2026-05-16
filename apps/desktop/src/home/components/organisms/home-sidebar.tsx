import { Favicon } from "@sanipatitas/desktop/core/components/atoms/favicon"
import { NavUser } from "@sanipatitas/desktop/home/components/molecules/nav-user"
import { useSidebarItems } from "@sanipatitas/desktop/home/hook/use-sidebar-items"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@sanipatitas/ui/components/ui/sidebar"
import { Link, useLocation } from "@tanstack/react-router"

// Component
export function HomeSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  // Pathname
  const { pathname } = useLocation()

  // Items
  const sidebarItems = useSidebarItems()

  return (
    <Sidebar
      collapsible="icon"
      className="top-header-h h-[calc(100vh-var(--header-height))]"
      {...props}
    >
      <SidebarHeader className="gap-0 p-0">
        <Link
          to="/"
          className="macos:mt-6 flex items-center gap-3 p-3 md:-mt-2!"
        >
          <Favicon className="size-6 min-h-6 min-w-6" />

          <span className="truncate text-sm group-data-[collapsible=icon]:sr-only">
            Veterinaria HC
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const isActive =
                  item.to === "/"
                    ? // Check if the item is the home route
                      item.to === pathname
                    : // Otherwise, check if the pathname starts with the item's route
                      item.to && pathname.startsWith(item.to)

                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      className="flex items-center gap-2 transition-colors group-data-[collapsible=icon]:px-1.5!"
                      isActive={Boolean(isActive)}
                      render={
                        <Link to={item.to} preload={false}>
                          <item.icon className="size-5!" />

                          <span>{item.label}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
