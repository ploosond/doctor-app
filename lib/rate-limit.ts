import "server-only"

import { headers } from "next/headers"

/**
 * Process-local fixed-window rate limiter. Sufficient for a single Elastic
 * Beanstalk instance (see plan/planning.md §5). If the app ever scales to more
 * than one instance, swap this Map for a shared store (Redis or a Mongo TTL
 * collection) — the call sites stay the same.
 */
type Window = { count: number; resetAt: number }

const windows = new Map<string, Window>()
let lastSweep = 0

function sweep(now: number) {
  // Lazily drop expired windows so the Map can't grow unbounded.
  if (now - lastSweep < 60_000) return
  lastSweep = now
  for (const [key, w] of windows) {
    if (w.resetAt <= now) windows.delete(key)
  }
}

export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number }
): { ok: boolean; retryAfterMs: number } {
  const now = Date.now()
  sweep(now)

  const existing = windows.get(key)
  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + opts.windowMs })
    return { ok: true, retryAfterMs: 0 }
  }

  if (existing.count >= opts.limit) {
    return { ok: false, retryAfterMs: existing.resetAt - now }
  }

  existing.count += 1
  return { ok: true, retryAfterMs: 0 }
}

/**
 * Resolve the client IP from request headers. The app sits behind CloudFront +
 * Elastic Beanstalk, so the real client is the first hop of x-forwarded-for.
 */
export async function clientIp(): Promise<string> {
  const h = await headers()
  const fwd = h.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0].trim()
  return h.get("x-real-ip")?.trim() || "unknown"
}
