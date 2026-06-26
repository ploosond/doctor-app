import { NextResponse } from "next/server"
import { getServiceBySlug } from "@/lib/services/catalog"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const svc = await getServiceBySlug(slug, { visibleOnly: true })
  if (!svc) return NextResponse.json(null, { status: 404 })
  return NextResponse.json(svc)
}
