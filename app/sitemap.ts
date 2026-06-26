import type { MetadataRoute } from "next"
import { listServices } from "@/lib/services/catalog"
import { env } from "@/lib/env"

const BASE = env.NEXT_PUBLIC_APP_URL

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, priority: 1 },
    { url: `${BASE}/privacy`, priority: 0.3 },
    { url: `${BASE}/terms`, priority: 0.3 },
  ]

  let serviceRoutes: MetadataRoute.Sitemap = []
  try {
    const services = await listServices({ visibleOnly: true })
    serviceRoutes = services.map((s) => ({ url: `${BASE}/services/${s.slug}`, priority: 0.7 }))
  } catch {
    // build may run before DB is reachable — services added at runtime via ISR
  }

  return [...staticRoutes, ...serviceRoutes]
}
