import type { ReactNode } from "react"

// Types
interface ListProps {
  children: ReactNode
}

// Component
export function List({ children }: ListProps) {
  return <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>
}
