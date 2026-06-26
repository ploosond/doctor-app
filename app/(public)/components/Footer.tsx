"use client"

import Link from "next/link"
import { useLang } from "@/lib/i18n"
import { Logo } from "@/components/Logo"

export function Footer() {
  const { t } = useLang()

  return (
    <footer
      style={{
        width: "100%",
        background: "var(--color-surface)",
        padding: "clamp(28px,6vw,48px) 0 clamp(18px,4vw,32px)",
      }}
    >
      <div className='section-container'>
        <div className='grid-footer'>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: 18 }}>
              <Logo height={54} />
            </div>
            <p
              style={{
                fontSize: 14.5,
                color: "var(--color-text-muted)",
                lineHeight: 1.65,
                margin: 0,
                maxWidth: "clamp(240px,90%,300px)",
              }}
            >
              {t.footer_desc}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                marginBottom: 16,
              }}
            >
              {t.foot_nav}
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["#about", t.nav_about],
                ["#services", t.nav_services],
                ["#journey", t.nav_journey],
                ["#faq", t.nav_faq],
                ["#contact", t.nav_contact],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  style={{
                    textDecoration: "none",
                    color: "var(--color-text-muted)",
                    fontSize: 14.5,
                    fontWeight: 500,
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color =
                      "var(--color-brand)")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color =
                      "var(--color-text-muted)")
                  }
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                marginBottom: 16,
              }}
            >
              Legal
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[[t.privacy, "/privacy"], [t.terms, "/terms"]].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    textDecoration: "none",
                    color: "var(--color-text-muted)",
                    fontSize: 14.5,
                    fontWeight: 500,
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color =
                      "var(--color-brand)")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color =
                      "var(--color-text-muted)")
                  }
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(23,42,58,0.12)",
            paddingTop: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
            {t.copyright}
          </span>
          {/* Crisis notice */}
          <span
            style={{
              fontSize: 12,
              color: "var(--color-brand)",
              fontWeight: 500,
            }}
          >
            In crisis? Call 1166 (Nepal Mental Health Helpline) — available 24/7
          </span>
        </div>
      </div>
    </footer>
  )
}
