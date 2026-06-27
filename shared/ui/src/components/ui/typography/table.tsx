import type { ReactNode } from "react"

// Types
interface TableProps {
  children: ReactNode
}

// Component
export function Table({ children }: TableProps) {
  return (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full">{children}</table>
    </div>
  )
}
