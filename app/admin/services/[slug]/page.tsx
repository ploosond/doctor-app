import { notFound } from "next/navigation"
import Link from "next/link"
import { getServiceBySlug } from "@/lib/services/catalog"
import { ServiceForm } from "../components/ServiceForm"
import { updateService } from "../actions"

export default async function EditServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const svc = await getServiceBySlug(slug)
  if (!svc) notFound()

  const action = updateService.bind(null, slug)

  return (
    <div className="admin-page" style={{ maxWidth: 800 }}>
      <div className="admin-page-head">
        <h1 className="admin-h1" style={{ margin: 0 }}>
          Edit service
        </h1>
        <Link
          href="/admin/services"
          style={{
            fontSize: 15,
            color: "var(--admin-muted)",
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
