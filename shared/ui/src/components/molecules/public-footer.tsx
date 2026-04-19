import { isDev } from "@sanipatitas/shared/app-context"
import { OpenapiLink } from "@sanipatitas/ui/components/atoms/openapi-link"
import { ThemeOptionSelect } from "@sanipatitas/ui/components/atoms/theme-option-select"

// Component
export function PublicFooter() {
  return (
    <footer className="flex w-full items-center justify-center px-5 py-2">
      {isDev && <OpenapiLink />}
      <ThemeOptionSelect />
    </footer>
  )
}
