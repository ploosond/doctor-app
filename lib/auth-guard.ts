import "server-only"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getAuth } from "@/lib/auth"

/**
 * Assert an authenticated admin session. Server-action endpoints are public
 * POST routes — layout-level gating does NOT protect them — so every mutation
 * must call this first. Redirects to /login when no session is present.
 */
export async function requireSession() {
  const auth = await getAuth()
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")
  return session
}
