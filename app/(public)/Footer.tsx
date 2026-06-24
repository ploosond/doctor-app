"use client";

import { useLang } from "@/lib/i18n";

export function Footer() {
  const { t } = useLang();

  return (
    <footer
      style={{
        width: "100%",
        background: "var(--color-surface)",
        padding: "48px 28px 32px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: 48,
            marginBottom: 48,
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "10px 22px",
                borderRadius: 999,
                background: "var(--color-brand)",
                marginBottom: 18,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sans), sans-serif",
                  fontWeight: 800,
                  fontSize: 20,
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
            </div>
            <p
              style={{
                fontSize: 14.5,
                color: "var(--color-text-muted)",
                lineHeight: 1.65,
                margin: 0,
                maxWidth: 300,
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
                    ((e.target as HTMLElement).style.color = "var(--color-brand)")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = "var(--color-text-muted)")
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
              {[t.privacy, t.terms].map((label) => (
                <a
                  key={label}
                  href="#"
                  style={{
                    textDecoration: "none",
                    color: "var(--color-text-muted)",
                    fontSize: 14.5,
                    fontWeight: 500,
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = "var(--color-brand)")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = "var(--color-text-muted)")
                  }
                >
                  {label}
                </a>
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
          }}
        >
          <span
            style={{ fontSize: 13, color: "var(--color-text-muted)" }}
          >
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
  );
}
