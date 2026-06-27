import { persistentJSON } from "@nanostores/persistent"
import { useStore } from "@nanostores/react"
import { type WritableAtom } from "nanostores"
import { useCallback, useMemo } from "react"

// Cache
const cache = new Map<string, WritableAtom<unknown>>()

// Factory
function getOrCreateStore<T>(key: string, initialValue: T): WritableAtom<T> {
  let $store = cache.get(key) as WritableAtom<T> | undefined

  if (!$store) {
    $store = persistentJSON<T>(key, initialValue)

    cache.set(key, $store)
  }

  return $store
}

// Hook
export function usePersistentState<T>(
  key: string,
  initialValue: T | (() => T)
): [T, (next: T | ((prev: T) => T)) => void] {
  // Store
  const $store = useMemo(() => {
    const resolvedInitialValue =
      typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue

      console.log("Rerendering")

    return getOrCreateStore(key, resolvedInitialValue)
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  // Value
  const value = useStore($store)

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === "function"
          ? (next as (prev: T) => T)($store.get())
          : next

      $store.set(resolved)
    },
    [$store]
  )

  return [value, setValue]
}
