import { createMemoryHistory, useRouter } from "@tanstack/react-router"

// Hook
export function useClearHistory() {
  const router = useRouter()

  const clearHistory = () => {
    router.update({
      ...router.options,
      history: createMemoryHistory(),
    })
  }

  return clearHistory
}
