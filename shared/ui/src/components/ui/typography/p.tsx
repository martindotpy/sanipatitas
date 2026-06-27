import type { ReactNode } from "react"

// Types
interface PProps {
  children: ReactNode
}

// Component
export function P({ children }: PProps) {
  return <p className="leading-7 not-first:mt-6">{children}</p>
}
