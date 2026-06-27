import type { ReactNode } from "react"

// Types
interface LeadProps {
  children: ReactNode
}

// Component
export function Lead({ children }: LeadProps) {
  return <p className="text-muted-foreground text-xl">{children}</p>
}
