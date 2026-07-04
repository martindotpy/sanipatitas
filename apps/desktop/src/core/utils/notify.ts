import {
  isTauri,
  isSsr,
} from "@sanipatitas/desktop/core/configuration/app-configuration"

// Types
interface NotifyOptions {
  body?: string
  icon?: string
  title: string
}

// Permission
let permissionGranted = false

export async function requestNotificationPermission() {
  if (isSsr || !isTauri) return

  try {
    const { isPermissionGranted, requestPermission } = await import(
      "@tauri-apps/plugin-notification"
    )

    if (await isPermissionGranted()) {
      permissionGranted = true
      return
    }

    const result = await requestPermission()
    permissionGranted = result === "granted"
  } catch {
    permissionGranted = false
  }
}

// Notify
export async function notify({ title, body, icon }: NotifyOptions) {
  if (isSsr) return

  // Tauri
  if (isTauri) {
    if (!permissionGranted) return

    try {
      const { sendNotification } = await import(
        "@tauri-apps/plugin-notification"
      )

      sendNotification({ title, body, icon })
    } catch {
      // silent
    }

    return
  }

  // Browser
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon })
  }
}
