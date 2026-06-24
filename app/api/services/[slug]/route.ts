import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { ServiceModel } from "@/models/service"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  await connectDB()
  const svc = await ServiceModel.findOne({ slug, visible: true }).lean()
  if (!svc) return NextResponse.json(null, { status: 404 })
  return NextResponse.json(svc)
}
