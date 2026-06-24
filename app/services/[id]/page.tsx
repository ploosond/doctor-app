import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { connectDB } from "@/lib/db"
import { ServiceModel } from "@/models/service"
import { ServiceDetailClient, type ServiceDoc } from "./ServiceDetailClient"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  await connectDB()
  const svc = await ServiceModel.findOne({ slug: id, visible: true }).lean() as ServiceDoc | null
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
  await connectDB()
  const svc = await ServiceModel.findOne({ slug: id, visible: true }).lean() as ServiceDoc | null
  if (!svc) notFound()
  return <ServiceDetailClient svc={JSON.parse(JSON.stringify(svc))} />
}
