import Link from "next/link"
import { listServices } from "@/lib/services/catalog"
import { deleteService, toggleServiceVisibility } from "./actions"
import { DeleteButton } from "./components/DeleteButton"

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export default async function ServicesAdminPage() {
  const services = await listServices()

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
            padding: "11px 22px",
            borderRadius: 10,
            background: "var(--color-brand)",
            color: "#fff",
            fontSize: 15,
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
            fontSize: 16,
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
            fontSize: 16,
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
                fontSize: 14,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {["Service (EN)", "Slug", "Tag", "Visible", "Created", "Actions"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "14px 18px", fontWeight: 600 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.map((svc) => (
              <tr key={String(svc._id)} style={{ borderBottom: "1px solid rgba(23,42,58,0.06)" }}>
                <td style={{ padding: "14px 18px", fontWeight: 600 }}>
                  {(svc.content as { en: { name: string } }).en?.name ?? "—"}
                </td>
                <td style={{ padding: "14px 18px", color: "var(--color-text-muted)", fontFamily: "monospace", fontSize: 15 }}>
                  {svc.slug}
                </td>
                <td style={{ padding: "14px 18px", color: "var(--color-text-muted)" }}>
                  {(svc.content as { en: { tag: string } }).en?.tag ?? "—"}
                </td>
                <td style={{ padding: "14px 18px" }}>
                  <form action={toggleServiceVisibility.bind(null, svc.slug)} style={{ display: "inline" }}>
                    <button
                      type="submit"
                      title={svc.visible ? "Visible — click to hide" : "Hidden — click to show"}
                      style={{
                        color: svc.visible ? "var(--color-brand)" : "var(--color-text-muted)",
                        fontWeight: 700,
                        fontSize: 16,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      {svc.visible ? "✓" : "–"}
                    </button>
                  </form>
                </td>
                <td style={{ padding: "14px 18px", color: "var(--color-text-muted)" }}>
                  {formatDate(svc.createdAt as Date)}
                </td>
                <td style={{ padding: "14px 18px", whiteSpace: "nowrap" }}>
                  <Link
                    href={`/services/${svc.slug}`}
                    target="_blank"
                    style={{
                      padding: "7px 14px",
                      borderRadius: 7,
                      background: "var(--color-surface)",
                      color: "var(--color-text-muted)",
                      fontSize: 14,
                      fontWeight: 600,
                      textDecoration: "none",
                      marginRight: 8,
                    }}
                  >
                    Preview ↗
                  </Link>
                  <Link
                    href={`/admin/services/${svc.slug}`}
                    style={{
                      padding: "7px 14px",
                      borderRadius: 7,
                      background: "var(--color-surface)",
                      color: "var(--color-brand)",
                      fontSize: 14,
                      fontWeight: 600,
                      textDecoration: "none",
                      marginRight: 8,
                    }}
                  >
                    Edit
                  </Link>
                  <DeleteButton action={deleteService.bind(null, svc.slug)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
