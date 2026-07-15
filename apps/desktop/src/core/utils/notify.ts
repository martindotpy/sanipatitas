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

export async function requestNotificationPermission(): Promise<boolean> {
  if (isSsr) return false

  // Tauri native notifications
  if (isTauri) {
    try {
      const { isPermissionGranted, requestPermission } = await import(
        "@tauri-apps/plugin-notification"
      )

      if (await isPermissionGranted()) {
        permissionGranted = true
        return true
      }

      const result = await requestPermission()
      permissionGranted = result === "granted"

      return permissionGranted
    } catch {
      permissionGranted = false
      return false
    }
  }

  // Browser Notification API
  if (typeof Notification === "undefined") return false

  if (Notification.permission === "granted") {
    permissionGranted = true
    return true
  }

  if (Notification.permission === "denied") {
    permissionGranted = false
    return false
  }

  // Permission is "default" — request it
  try {
    const result = await Notification.requestPermission()
    permissionGranted = result === "granted"

    return permissionGranted
  } catch {
    permissionGranted = false
    return false
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
