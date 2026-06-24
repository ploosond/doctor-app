import { redirect } from "next/navigation"
import { headers } from "next/headers"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { AdminSignOut } from "./AdminSignOut"

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "▪" },
  { label: "Appointments", href: "/admin/appointments", icon: "▪" },
  { label: "Patients", href: "/admin/patients", icon: "▪" },
  { label: "Services", href: "/admin/services", icon: "▪" },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--color-bg)" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          background: "var(--color-brand)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div style={{ padding: "28px 20px 20px" }}>
          <Link
            href="/admin/dashboard"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 16px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.15)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-sans), sans-serif",
                fontWeight: 800,
                fontSize: 17,
                letterSpacing: "-0.03em",
                color: "#fff",
              }}
            >
              dr.lila
            </span>
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#fff",
                alignSelf: "flex-end",
                margin: "0 0 3px 2px",
              }}
            />
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "8px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 10,
                textDecoration: "none",
                color: "rgba(255,255,255,0.85)",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom: user info + sign out */}
        <div
          style={{
            padding: "16px 20px 24px",
            borderTop: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.5)",
              marginBottom: 10,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {session.user.email}
          </div>
          <AdminSignOut />
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: 240, flex: 1, minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
