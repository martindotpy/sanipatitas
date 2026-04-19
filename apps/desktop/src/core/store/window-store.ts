import { useStore } from "@nanostores/react"
import { isSsr } from "@sanipatitas/desktop/core/configuration/app-configuration"
import { getCurrentWindow, Window } from "@tauri-apps/api/window"
import { atom } from "nanostores"

// Store
export const $window = atom<Window | null>(null)

// Initialization
if (!isSsr) {
  $window.set(getCurrentWindow())
}

// Hook
export function useWindow() {
  const window = useStore($window)

  return window
}
