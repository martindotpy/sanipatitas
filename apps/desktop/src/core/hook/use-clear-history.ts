import { createBrowserHistory, useRouter } from "@tanstack/react-router"

// Hook
export function useClearHistory() {
  const router = useRouter()

  const clearHistory = () => {
    router.update({
      ...router.options,
      history: createBrowserHistory(),
    })
  }

  return clearHistory
}
