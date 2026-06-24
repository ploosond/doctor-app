"use server"

import { connectDB } from "@/lib/db"
import { ServiceModel } from "@/models/service"
import { uploadImage, deleteImage } from "@/lib/cloudinary"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

function parseIncluded(fd: FormData, lang: "en" | "ne"): string[] {
  const items: string[] = []
  for (let i = 0; ; i++) {
    const v = fd.get(`included_${lang}_${i}`) as string | null
    if (v === null) break
    if (v.trim()) items.push(v.trim())
  }
  return items
}

function parseSteps(fd: FormData, lang: "en" | "ne") {
  return [0, 1, 2].map((i) => ({
    title: ((fd.get(`step_${lang}_${i}_title`) as string) ?? "").trim(),
    desc:  ((fd.get(`step_${lang}_${i}_desc`)  as string) ?? "").trim(),
  }))
}

export async function createService(fd: FormData) {
  await connectDB()

  const keywords = ((fd.get("keywords") as string) ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean)

  // Upload service image to Cloudinary if provided
  let imageUrl: string | undefined
  const imageFile = fd.get("image") as File | null
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadImage(imageFile)
  }

  await ServiceModel.create({
    slug:    (fd.get("slug") as string).trim().toLowerCase(),
    image:   imageUrl,
    visible: fd.get("visible") === "on",
    content: {
      en: {
        name:     fd.get("en_name"),
        tag:      fd.get("en_tag"),
        headline: fd.get("en_headline"),
        intro:    fd.get("en_intro"),
        duration: fd.get("en_duration"),
        format:   fd.get("en_format"),
        price:    fd.get("en_price"),
        followup: fd.get("en_followup"),
        included: parseIncluded(fd, "en"),
        steps:    parseSteps(fd, "en"),
      },
      ne: {
        name:     fd.get("ne_name"),
        tag:      fd.get("ne_tag"),
        headline: fd.get("ne_headline"),
        intro:    fd.get("ne_intro"),
        duration: fd.get("ne_duration"),
        format:   fd.get("ne_format"),
        price:    fd.get("ne_price"),
        followup: fd.get("ne_followup"),
        included: parseIncluded(fd, "ne"),
        steps:    parseSteps(fd, "ne"),
      },
    },
    metaTitle:       (fd.get("metaTitle") as string) || undefined,
    metaDescription: (fd.get("metaDescription") as string) || undefined,
    keywords,
    ogImage:         (fd.get("ogImage") as string) || undefined,
  })

  revalidatePath("/admin/services")
  revalidatePath("/")
  redirect("/admin/services")
}

export async function updateService(slug: string, fd: FormData) {
  await connectDB()
  const svc = await ServiceModel.findOne({ slug })
  if (!svc) throw new Error("Service not found")

  const keywords = ((fd.get("keywords") as string) ?? "")
    .split(",").map((k) => k.trim()).filter(Boolean)

  const imageFile = fd.get("image") as File | null
  if (imageFile && imageFile.size > 0) {
    const oldImage = svc.image
    svc.image = await uploadImage(imageFile)   // upload first
    if (oldImage) await deleteImage(oldImage)  // delete old only on success
  }

  svc.visible = fd.get("visible") === "on"
  svc.content = {
    en: {
      name:     fd.get("en_name"),
      tag:      fd.get("en_tag"),
      headline: fd.get("en_headline"),
      intro:    fd.get("en_intro"),
      duration: fd.get("en_duration"),
      format:   fd.get("en_format"),
      price:    fd.get("en_price"),
      followup: fd.get("en_followup"),
      included: parseIncluded(fd, "en"),
      steps:    parseSteps(fd, "en"),
    },
    ne: {
      name:     fd.get("ne_name"),
      tag:      fd.get("ne_tag"),
      headline: fd.get("ne_headline"),
      intro:    fd.get("ne_intro"),
      duration: fd.get("ne_duration"),
      format:   fd.get("ne_format"),
      price:    fd.get("ne_price"),
      followup: fd.get("ne_followup"),
      included: parseIncluded(fd, "ne"),
      steps:    parseSteps(fd, "ne"),
    },
  }
  svc.metaTitle       = (fd.get("metaTitle") as string) || undefined
  svc.metaDescription = (fd.get("metaDescription") as string) || undefined
  svc.keywords        = keywords
  svc.ogImage         = (fd.get("ogImage") as string) || undefined

  await svc.save()
  revalidatePath("/admin/services")
  revalidatePath(`/services/${slug}`)
  revalidatePath("/")
  redirect("/admin/services")
}

export async function deleteService(slug: string) {
  await connectDB()
  const svc = await ServiceModel.findOne({ slug })
  if (svc) {
    if (svc.image) await deleteImage(svc.image)
    await ServiceModel.deleteOne({ slug })
  }
  revalidatePath("/admin/services")
  revalidatePath("/")
  redirect("/admin/services")
}
