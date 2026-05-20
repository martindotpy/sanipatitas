import { useStore } from "@nanostores/react"
import {
  isSsr,
  isTauri,
} from "@sanipatitas/desktop/core/configuration/app-configuration"
import { getCurrentWindow, type Window } from "@tauri-apps/api/window"
import { atom } from "nanostores"

// Store
export const $window = atom<Window | null>(null)

// Initialization
if (!isSsr) {
  if (isTauri) {
    $window.set(getCurrentWindow())
  }
}

// Hook
export function useWindow() {
  const window = useStore($window)

  return window
}
