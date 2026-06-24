import { notFound } from "next/navigation"
import Link from "next/link"
import { connectDB } from "@/lib/db"
import { ServiceModel } from "@/models/service"
import { ServiceForm } from "../new/ServiceForm"
import { updateService } from "../actions"

export default async function EditServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  await connectDB()
  const svc = await ServiceModel.findOne({ slug }).lean()
  if (!svc) notFound()

  const action = updateService.bind(null, slug)

  return (
    <div style={{ padding: "36px 40px", maxWidth: 860 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "var(--font-heading), serif",
            fontWeight: 500,
            fontSize: 28,
            letterSpacing: "-0.01em",
            color: "var(--color-text)",
            margin: 0,
          }}
        >
          Edit service
        </h1>
        <Link
          href="/admin/services"
          style={{
            fontSize: 13,
            color: "var(--color-text-muted)",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          ← Back to services
        </Link>
      </div>
      <ServiceForm action={action} initialData={svc as Parameters<typeof ServiceForm>[0]["initialData"]} />
    </div>
  )
}
