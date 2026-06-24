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
        padding: "clamp(44px,10vh,80px) 0",
      }}
    >
      <div className="section-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "clamp(30px,7vh,50px)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "clamp(6px,2vw,8px) clamp(14px,4vw,22px)",
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
        <div className="grid-stats">
          {STATS.map(({ valKey, labelKey }, i) => (
            <div
              key={i}
              style={{
                padding: "0 clamp(12px,3vw,32px)",
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
