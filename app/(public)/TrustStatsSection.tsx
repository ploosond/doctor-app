"use client";

import { useLang } from "@/lib/i18n";

const STATS = [
  { valKey: "stat1_val" as const, labelKey: "stat1" as const },
  { valKey: "stat2_val" as const, labelKey: "stat2" as const },
  { valKey: "stat3_val" as const, labelKey: "stat3" as const },
  { valKey: "stat4_val" as const, labelKey: "stat4" as const },
];

export function TrustStatsSection() {
  const { t } = useLang();

  return (
    <section
      style={{
        width: "100%",
        background: "var(--color-surface)",
        padding: "80px 28px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 50,
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "8px 22px",
              borderRadius: 999,
              border: "1px solid var(--color-accent)",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--color-brand)",
              letterSpacing: "0.02em",
            }}
          >
            {t.why_badge}
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 0,
          }}
        >
          {STATS.map(({ valKey, labelKey }, i) => (
            <div
              key={i}
              style={{
                padding: "0 32px",
                borderRight:
                  i < 3 ? "1px solid var(--color-accent)" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-heading), serif",
                  fontSize: "clamp(42px,4.5vw,64px)",
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                  color: "var(--color-text)",
                  marginBottom: 12,
                }}
              >
                {t[valKey]}
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: "var(--color-text-muted)",
                  lineHeight: 1.6,
                }}
              >
                {t[labelKey]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
