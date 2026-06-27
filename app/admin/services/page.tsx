import Link from "next/link"
import { listServices } from "@/lib/services/catalog"
import { deleteService, toggleServiceVisibility } from "./actions"
import { DeleteButton } from "./components/DeleteButton"
import { FlashBanner } from "../components/FlashBanner"

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export default async function ServicesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ flash?: string }>
}) {
  const { flash } = await searchParams
  const services = await listServices()

  return (
    <div className="admin-page">
      <FlashBanner code={flash} />
      <div className="admin-page-head">
        <h1 className="admin-h1" style={{ margin: 0 }}>
          Services
        </h1>
        <Link
          href="/admin/services/new"
          style={{
            padding: "10px 20px",
            borderRadius: 8,
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
            color: "var(--admin-muted)",
            fontSize: 15,
            background: "var(--admin-card)",
            border: "1px solid var(--admin-border)",
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
          className="admin-table"
          style={{
            fontSize: 15,
            color: "var(--color-text)",
            background: "var(--admin-card)",
            border: "1px solid var(--admin-border)",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "var(--admin-shadow)",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#FAFBFC",
                borderBottom: "1px solid var(--admin-border)",
                color: "var(--admin-muted)",
                fontSize: 12.5,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {["Service (EN)", "Slug", "Tag", "Visible", "Created", "Actions"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 18px", fontWeight: 600 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.map((svc) => (
              <tr key={String(svc._id)} style={{ borderBottom: "1px solid var(--admin-border)" }}>
                <td data-label="Service (EN)" style={{ padding: "14px 18px", fontWeight: 600 }}>
                  {(svc.content as { en: { name: string } }).en?.name ?? "—"}
                </td>
                <td data-label="Slug" style={{ padding: "14px 18px", color: "var(--admin-muted)", fontFamily: "monospace", fontSize: 15 }}>
                  {svc.slug}
                </td>
                <td data-label="Tag" style={{ padding: "14px 18px", color: "var(--admin-muted)" }}>
                  {(svc.content as { en: { tag: string } }).en?.tag ?? "—"}
                </td>
                <td data-label="Visible" style={{ padding: "14px 18px" }}>
                  <form action={toggleServiceVisibility.bind(null, svc.slug)} style={{ display: "inline" }}>
                    <button
                      type="submit"
                      title={svc.visible ? "Visible — click to hide" : "Hidden — click to show"}
                      style={{
                        color: svc.visible ? "var(--color-brand)" : "var(--admin-muted)",
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
                <td data-label="Created" style={{ padding: "14px 18px", color: "var(--admin-muted)" }}>
                  {formatDate(svc.createdAt as Date)}
                </td>
                <td data-label="" style={{ padding: "14px 18px" }}>
                  <Link
                    href={`/services/${svc.slug}`}
                    target="_blank"
                    style={{
                      padding: "7px 14px",
                      borderRadius: 8,
                      background: "var(--admin-card)",
                      border: "1px solid var(--admin-border)",
                      color: "var(--admin-muted)",
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
                      borderRadius: 8,
                      background: "var(--admin-card)",
                      border: "1px solid var(--admin-border)",
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
