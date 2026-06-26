"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  createService as createServiceSvc,
  updateService as updateServiceSvc,
  toggleVisibility,
  deleteService as deleteServiceSvc,
  type ServiceInput,
} from "@/lib/services/catalog"
import { requireSession } from "@/lib/auth-guard"

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
    desc: ((fd.get(`step_${lang}_${i}_desc`) as string) ?? "").trim(),
  }))
}

function locale(fd: FormData, lang: "en" | "ne") {
  return {
    name: (fd.get(`${lang}_name`) as string) ?? "",
    tag: (fd.get(`${lang}_tag`) as string) ?? "",
    headline: (fd.get(`${lang}_headline`) as string) ?? "",
    intro: (fd.get(`${lang}_intro`) as string) ?? "",
    duration: (fd.get(`${lang}_duration`) as string) ?? "",
    format: (fd.get(`${lang}_format`) as string) ?? "",
    price: (fd.get(`${lang}_price`) as string) ?? "",
    followup: (fd.get(`${lang}_followup`) as string) ?? "",
    included: parseIncluded(fd, lang),
    steps: parseSteps(fd, lang),
  }
}

function buildInput(fd: FormData): ServiceInput {
  return {
    slug: (fd.get("slug") as string) ?? "",
    visible: fd.get("visible") === "on",
    content: { en: locale(fd, "en"), ne: locale(fd, "ne") },
    metaTitle: (fd.get("metaTitle") as string) || undefined,
    metaDescription: (fd.get("metaDescription") as string) || undefined,
    keywords: ((fd.get("keywords") as string) ?? "").split(",").map((k) => k.trim()).filter(Boolean),
    ogImage: (fd.get("ogImage") as string) || undefined,
  }
}

export async function createService(fd: FormData) {
  await requireSession()
  await createServiceSvc(buildInput(fd), fd.get("image") as File | null)
  revalidatePath("/admin/services")
  revalidatePath("/")
  redirect("/admin/services")
}

export async function updateService(slug: string, fd: FormData) {
  await requireSession()
  await updateServiceSvc(slug, buildInput(fd), fd.get("image") as File | null)
  revalidatePath("/admin/services")
  revalidatePath(`/services/${slug}`)
  revalidatePath("/")
  redirect("/admin/services")
}

export async function toggleServiceVisibility(slug: string) {
  await requireSession()
  await toggleVisibility(slug)
  revalidatePath("/admin/services")
  revalidatePath("/")
  revalidatePath(`/services/${slug}`)
}

export async function deleteService(slug: string) {
  await requireSession()
  await deleteServiceSvc(slug)
  revalidatePath("/admin/services")
  revalidatePath("/")
  redirect("/admin/services")
}
