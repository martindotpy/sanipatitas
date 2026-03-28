import { getCurrentWindow } from "@tauri-apps/api/window"

// Get current window
const currentWindow = getCurrentWindow()

// Show the current window
requestAnimationFrame(() => {
  requestAnimationFrame(async () => {
    await currentWindow.show()
  })
})
