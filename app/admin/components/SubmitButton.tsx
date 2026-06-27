"use client"

import { useFormStatus } from "react-dom"
import type { CSSProperties } from "react"

export function SubmitButton({
  label,
  pendingLabel = "Saving…",
  style,
}: {
  label: string
  pendingLabel?: string
  style?: CSSProperties
}) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        cursor: pending ? "not-allowed" : "pointer",
        opacity: pending ? 0.6 : 1,
        ...style,
      }}
    >
      {pending ? pendingLabel : label}
    </button>
  )
}
