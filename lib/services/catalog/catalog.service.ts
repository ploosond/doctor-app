// Internal — do not import directly. Use the public API in ./index.ts.

import { connectDB } from "@/lib/db"
import { ServiceModel } from "@/models/service"
import { uploadImage, deleteImage } from "@/lib/cloudinary"

type LocaleContent = {
  name?: string
  tag?: string
  headline?: string
  intro?: string
  duration?: string
  format?: string
  price?: string
  followup?: string
  included: string[]
  steps: { title: string; desc: string }[]
}

export type ServiceInput = {
  slug?: string
  visible: boolean
  content: { en: LocaleContent; ne: LocaleContent }
  metaTitle?: string
  metaDescription?: string
  keywords: string[]
  ogImage?: string
}

export type ServiceRecord = Record<string, unknown> & { slug: string }

export async function listServices(opts: { visibleOnly?: boolean } = {}): Promise<ServiceRecord[]> {
  await connectDB()
  const filter = opts.visibleOnly ? { visible: true } : {}
  return (await ServiceModel.find(filter).sort({ createdAt: -1 }).lean()) as unknown as ServiceRecord[]
}

export async function getServiceBySlug(
  slug: string,
  opts: { visibleOnly?: boolean } = {}
): Promise<ServiceRecord | null> {
  await connectDB()
  const filter = opts.visibleOnly ? { slug, visible: true } : { slug }
  return (await ServiceModel.findOne(filter).lean()) as unknown as ServiceRecord | null
}

export async function createService(input: ServiceInput, imageFile?: File | null): Promise<void> {
  await connectDB()
  let image: string | undefined
  if (imageFile && imageFile.size > 0) image = await uploadImage(imageFile)

  await ServiceModel.create({
    slug: (input.slug ?? "").trim().toLowerCase(),
    image,
    visible: input.visible,
    content: input.content,
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    keywords: input.keywords,
    ogImage: input.ogImage,
  })
}

export async function updateService(slug: string, input: ServiceInput, imageFile?: File | null): Promise<void> {
  await connectDB()
  const svc = await ServiceModel.findOne({ slug })
  if (!svc) throw new Error("Service not found")

  if (imageFile && imageFile.size > 0) {
    const oldImage = svc.image
    svc.image = await uploadImage(imageFile) // upload first
    if (oldImage) await deleteImage(oldImage) // delete old only on success
  }

  svc.visible = input.visible
  svc.content = input.content
  svc.metaTitle = input.metaTitle
  svc.metaDescription = input.metaDescription
  svc.keywords = input.keywords
  svc.ogImage = input.ogImage
  await svc.save()
}

export async function toggleVisibility(slug: string): Promise<void> {
  await connectDB()
  const svc = await ServiceModel.findOne({ slug })
  if (svc) {
    svc.visible = !svc.visible
    await svc.save()
  }
}

export async function deleteService(slug: string): Promise<void> {
  await connectDB()
  const svc = await ServiceModel.findOne({ slug })
  if (svc) {
    if (svc.image) await deleteImage(svc.image)
    await ServiceModel.deleteOne({ slug })
  }
}
