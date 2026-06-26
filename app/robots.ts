import type { MetadataRoute } from "next"
import { env } from "@/lib/env"

const BASE = env.NEXT_PUBLIC_APP_URL

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/login", "/forgot-password", "/reset-password", "/verify-email"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  }
}
