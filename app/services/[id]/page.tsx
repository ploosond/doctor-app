export const revalidate = 3600 // ISR — regenerate hourly; first build can't reach private-VPC Mongo

import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getServiceBySlug } from "@/lib/services/catalog"
import { sampleImageUrl } from "@/lib/cloudinary-sample"
import { ServiceDetailClient, type ServiceDoc } from "../components/ServiceDetailClient"

type Props = { params: Promise<{ id: string }> }

async function getService(slug: string): Promise<ServiceDoc | null> {
  try {
    return (await getServiceBySlug(slug, { visibleOnly: true })) as unknown as ServiceDoc | null
  } catch {
    // build runs before Mongo is reachable — ISR fetches real data at runtime
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const svc = await getService(id)
  if (!svc) return {}
  const en = svc.content.en
  return {
    title: (svc.metaTitle || en.name) + " — Dr. Lila",
    description: svc.metaDescription || en.headline,
    keywords: svc.keywords as string[] | undefined,
    openGraph: {
      title: svc.metaTitle || en.name,
      description: svc.metaDescription || en.headline,
      images: svc.ogImage ? [{ url: svc.ogImage }] : [],
    },
  }
}

export default async function ServicePage({ params }: Props) {
  const { id } = await params
  const svc = await getService(id)
  if (!svc) notFound()
  const resolved = { ...svc, image: svc.image ?? svc.ogImage ?? sampleImageUrl(id) }
  return <ServiceDetailClient svc={JSON.parse(JSON.stringify(resolved))} />
}
