import { NextResponse, type NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

// Defense-in-depth for /admin. This is an optimistic cookie-presence check only
// (no DB hit) — the authoritative gate is requireSession() in each server action
// and the session check in app/admin/layout.tsx.
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
