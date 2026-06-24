import Link from "next/link"
import { connectDB } from "@/lib/db"
import { ServiceModel } from "@/models/service"

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export default async function ServicesAdminPage() {
  await connectDB()
  const services = await ServiceModel.find().sort({ createdAt: -1 }).lean()

  return (
    <div style={{ padding: "36px 40px" }}>
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
          Services
        </h1>
        <Link
          href="/admin/services/new"
          style={{
            padding: "9px 20px",
            borderRadius: 10,
            background: "var(--color-brand)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          + New service
        </Link>
      </div>

      {services.length === 0 ? (
        <div
          style={{
            padding: "60px",
            textAlign: "center",
            color: "var(--color-text-muted)",
            fontSize: 14,
            background: "var(--color-surface)",
            borderRadius: 12,
          }}
        >
          No services yet.{" "}
          <Link href="/admin/services/new" style={{ color: "var(--color-brand)", fontWeight: 600 }}>
            Create one →
          </Link>
        </div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 14,
            color: "var(--color-text)",
            background: "#fff",
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(23,42,58,0.06)",
          }}
        >
          <thead>
            <tr
              style={{
                background: "var(--color-surface)",
                color: "var(--color-text-muted)",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {["Service (EN)", "Slug", "Tag", "Visible", "Created", ""].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "11px 16px", fontWeight: 700 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.map((svc) => (
              <tr key={String(svc._id)} style={{ borderBottom: "1px solid rgba(23,42,58,0.06)" }}>
                <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                  {(svc.content as { en: { name: string } }).en?.name ?? "—"}
                </td>
                <td style={{ padding: "12px 16px", color: "var(--color-text-muted)", fontFamily: "monospace", fontSize: 13 }}>
                  {svc.slug}
                </td>
                <td style={{ padding: "12px 16px", color: "var(--color-text-muted)" }}>
                  {(svc.content as { en: { tag: string } }).en?.tag ?? "—"}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ color: svc.visible ? "var(--color-brand)" : "var(--color-text-muted)", fontWeight: 700 }}>
                    {svc.visible ? "✓" : "–"}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", color: "var(--color-text-muted)" }}>
                  {formatDate(svc.createdAt as Date)}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <Link
                    href={`/services/${svc.slug}`}
                    target="_blank"
                    style={{ fontSize: 12, color: "var(--color-text-muted)", textDecoration: "none", marginRight: 12 }}
                  >
                    Preview ↗
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
