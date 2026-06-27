import type { ReactNode } from "react"

// Types
interface SmallProps {
  children: ReactNode
}

// Component
export function Small({ children }: SmallProps) {
  return <small className="text-sm leading-none font-medium">{children}</small>
}
