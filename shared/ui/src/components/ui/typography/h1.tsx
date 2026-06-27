import type { ReactNode } from "react"

// Component
interface H1Props {
  children: ReactNode
}

export function H1({ children }: H1Props) {
  return (
    <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
      {children}
    </h1>
  )
}
