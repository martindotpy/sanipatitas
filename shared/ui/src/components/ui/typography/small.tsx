import type { ReactNode } from "react"

// Types
interface SmallProps {
  children: ReactNode
  className?: string
}

// Component
export function Small({ children, className }: SmallProps) {
  return (
    <small
      className={`text-sm leading-none font-medium${className ? ` ${className}` : ""}`}
    >
      {children}
    </small>
  )
}
