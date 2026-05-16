import { Link } from "@sanipatitas/ui/components/ui/link"
import { TbApi } from "react-icons/tb"

// Component
export function OpenapiLink() {
  return (
    <Link href="/docs" variant="ghost" size="icon-lg">
      <TbApi className="size-5" />
    </Link>
  )
}
