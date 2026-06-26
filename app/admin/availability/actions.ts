"use server"

import { revalidatePath } from "next/cache"
import { saveAvailability, type WorkingHour } from "@/lib/services/availability"

export async function updateAvailability(fd: FormData) {
  const workingHours: WorkingHour[] = []
  for (let day = 0; day <= 6; day++) {
    const start = (fd.get(`start_${day}`) as string) ?? ""
    const end = (fd.get(`end_${day}`) as string) ?? ""
    const enabled = fd.get(`enabled_${day}`) === "on"
    if (start && end) workingHours.push({ day, start, end, enabled })
  }

  const blockedDates = (fd.getAll("blockedDate") as string[])
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => new Date(d))

  const slotDurationMins = parseInt((fd.get("slotDurationMins") as string) ?? "30", 10) || 30
  const bufferMins = parseInt((fd.get("bufferMins") as string) ?? "10", 10) || 0

  await saveAvailability({ workingHours, slotDurationMins, bufferMins, blockedDates })
  revalidatePath("/admin/availability")
}
