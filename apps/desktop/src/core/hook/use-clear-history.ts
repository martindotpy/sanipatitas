import { createMemoryHistory, useRouter } from "@tanstack/react-router"

// Hook
export function useClearHistory() {
  const router = useRouter()

  const clearHistory = () => {
    router.update({
      ...router.options,
      history: createMemoryHistory({
        initialEntries: [router.state.location.pathname],
        initialIndex: 0,
      }),
    })
  }

  return clearHistory
}
