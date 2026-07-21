import type { OpenapiViolation } from "@sanipatitas/shared/api/client/types.gen"
import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form"

// Backend Problem Details for Bean Validation errors carry a `violations` array.
// Map each violation onto the matching form field so it shows inline (via the
// FieldError that the controlled inputs already render), instead of only a toast.
//
// Returns the number of field errors applied (0 when the error has no
// field-level violations — e.g. a 409 duplicate — so the caller can fall back
// to a toast).
export function applyServerValidationErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>
): number {
  const violations = (error as { violations?: OpenapiViolation[] } | null)
    ?.violations

  if (!Array.isArray(violations) || violations.length === 0) return 0

  let applied = 0

  for (const violation of violations) {
    if (!violation?.field || !violation.message) continue

    // Field path may be prefixed (e.g. "create.request.email") — keep the last segment.
    const name = violation.field.split(".").pop() as FieldPath<T> | undefined

    if (!name) continue

    setError(name, { type: "server", message: violation.message })
    applied++
  }

  return applied
}
