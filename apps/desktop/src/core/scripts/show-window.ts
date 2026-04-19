import { $window } from "@sanipatitas/desktop/core/store/window-store"

// Show window on load
window.addEventListener("load", () =>
  setTimeout(() => $window.get()?.show(), 0)
)
