// Internal — do not import directly. Use the public API in ./index.ts.

import { Resend } from "resend"
import { env } from "@/lib/env"

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<void> {
  const apiKey = env.RESEND_API_KEY
  const from = env.RESEND_FROM

  if (!apiKey || !from) {
    console.warn("[notifications] email skipped — RESEND_API_KEY or RESEND_FROM not set")
    return
  }
  if (!to) return

  try {
    const resend = new Resend(apiKey)
    await resend.emails.send({ from, to, subject, html })
  } catch (err) {
    console.error("[notifications] email send failed:", err)
  }
}
