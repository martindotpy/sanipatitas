import type { ReactNode } from "react"

// Component
interface H2Props {
  children: ReactNode
  className?: string
}

export function H2({ children, className }: H2Props) {
  return (
    <h2 className={`scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0${className ? ` ${className}` : ""}`}>
      {children}
    </h2>
  )
}
