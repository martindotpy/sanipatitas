import type { ReactNode } from "react"

// Types
interface MutedProps {
  children: ReactNode
}

// Component
export function Muted({ children }: MutedProps) {
  return <p className="text-muted-foreground text-sm">{children}</p>
}
