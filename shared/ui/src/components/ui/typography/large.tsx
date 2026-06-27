import type { ReactNode } from "react"

// Types
interface LargeProps {
  children: ReactNode
}

// Component
export function Large({ children }: LargeProps) {
  return <div className="text-lg font-semibold">{children}</div>
}
