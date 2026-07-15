import { persistentJSON } from "@nanostores/persistent"
import { useStore } from "@nanostores/react"
import { type WritableAtom } from "nanostores"
import { useCallback, useMemo } from "react"

// Types
export interface NotificationPreferences {
  enabled: boolean
  reminderWindowMinutes: number
  upcomingNotifications: boolean
  sseUpdates: boolean
}

// Defaults
export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  enabled: true,
  reminderWindowMinutes: 15,
  upcomingNotifications: true,
  sseUpdates: true,
}

// Key
const STORAGE_KEY = "sanipatitas:notification-preferences"

// Store
let $notificationPreferences = persistentJSON<NotificationPreferences>(
  STORAGE_KEY,
  DEFAULT_NOTIFICATION_PREFERENCES,
)

// Hook
export function useNotificationPreferences() {
  const preferences = useStore($notificationPreferences)

  const setPreferences = useCallback(
    (next: NotificationPreferences | ((prev: NotificationPreferences) => NotificationPreferences)) => {
      const resolved =
        typeof next === "function"
          ? (next as (prev: NotificationPreferences) => NotificationPreferences)($notificationPreferences.get())
          : next

      $notificationPreferences.set(resolved)
    },
    [],
  )

  return [preferences, setPreferences] as const
}

// Reset to defaults
export function resetNotificationPreferences() {
  $notificationPreferences.set(DEFAULT_NOTIFICATION_PREFERENCES)
}
