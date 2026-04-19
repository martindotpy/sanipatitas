import { useWindow } from "@sanipatitas/desktop/core/store/window-store"
import { useEffect } from "react"

// Hook
export function useInit() {
  // Window
  const window = useWindow()

  useEffect(() => {
    ;(async () => {
      // Show window
      await window?.show()
    })()
  }, [window])
}
