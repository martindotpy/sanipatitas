import { buttonVariants } from "@sanipatitas/ui/components/ui/button"
import { TbApi } from "react-icons/tb"

// Component
export function OpenapiLink() {
  return (
    <a
      href="/docs"
      className={buttonVariants({ variant: "ghost", size: "icon-lg" })}
    >
      <TbApi className="size-5" />
    </a>
  )
}
