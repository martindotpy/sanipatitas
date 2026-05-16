import { useMatches } from "@tanstack/react-router"

// Hook
export function useIsSidebarActive() {
  const isSidebarActive = useMatches({
    select: (matches) => matches.some((match) => match.staticData?.sidebar),
  })

  return isSidebarActive
}
