"use client";

import { useLang } from "@/lib/i18n";

const CARD_STYLES = [
  { bg: "#fff", textColor: "var(--color-text)", quoteColor: "rgba(0,67,70,0.15)" },
  { bg: "var(--color-surface)", textColor: "var(--color-text)", quoteColor: "rgba(0,67,70,0.18)" },
  { bg: "#fff", textColor: "var(--color-text)", quoteColor: "rgba(0,67,70,0.15)" },
  { bg: "var(--color-surface)", textColor: "var(--color-text)", quoteColor: "rgba(0,67,70,0.18)" },
];

export function TestimonialsSection() {
  const { t } = useLang();
  const items = [...t.testimonials, ...t.testimonials];

  return (
    <section
      data-screen-label="Testimonials"
      style={{ width: "100%", padding: "clamp(32px,8vw,60px) 0", overflow: "hidden" }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: 620,
          margin: "0 auto 44px",
          padding: "0 28px",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-heading), serif",
            fontWeight: 500,
            fontSize: "clamp(30px,3.6vw,42px)",
            letterSpacing: "-0.02em",
            margin: "12px 0 0",
            lineHeight: 1.08,
          }}
        >
          {t.testi_pre}
          <em style={{ fontStyle: "italic", fontWeight: 400 }}>{t.testi_em}</em>
          {t.testi_post}
        </h2>
      </div>

      <div style={{ width: "100%", overflow: "hidden" }}>
        <div
          className="animate-marquee"
          style={{ display: "flex", gap: 24, width: "max-content" }}
        >
          {items.map((tm, i) => {
            const style = CARD_STYLES[i % CARD_STYLES.length];
            return (
              <div
                key={i}
                style={{
                  width: "clamp(280px,80vw,320px)",
                  flexShrink: 0,
                  borderRadius: 22,
                  padding: "clamp(18px,4vw,28px)",
                  background: style.bg,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {/* Quote mark */}
                <svg
                  width={22}
                  height={16}
                  viewBox="0 0 36 28"
                  fill={style.quoteColor}
                >
                  <path d="M0 28V16.8C0 5.6 5.4.8 16.2 0l1.2 4.8C10.2 6 7.2 9.2 6.6 14H14v14H0Zm20 0V16.8C20 5.6 25.4.8 36.2 0l1.2 4.8c-7.2 1.2-10.2 4.4-10.8 9.2H34v14H20Z" />
                </svg>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: style.textColor,
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {tm.quote}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "auto",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: style.textColor,
                      }}
                    >
                      {tm.name}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
                      {tm.loc}
                    </div>
                  </div>
                  {/* Stars */}
                  <div style={{ display: "flex", gap: 2 }}>
                    {Array.from({ length: 5 }).map((_, s) => (
                      <svg key={s} width={13} height={13} viewBox="0 0 24 24" fill="var(--color-brand)">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
