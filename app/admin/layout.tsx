export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { getAuth } from "@/lib/auth"
import { AdminNav } from "./components/AdminNav"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const auth = await getAuth()
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--color-bg)",
      }}
    >
      <AdminNav email={session.user.email} />

      {/* Main content */}
      <main
        className="admin-shell admin-main"
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: "100vh",
          background: "var(--admin-bg)",
        }}
      >
        {children}
      </main>
    </div>
  )
}
