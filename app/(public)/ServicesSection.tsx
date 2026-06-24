"use client";

import { useLang } from "@/lib/i18n";
import { ArrowRight } from "lucide-react";

const SERVICES = [
  { titleKey: "svc1t" as const, groupKey: "svc1g" as const, id: "consult",  seed: 11 },
  { titleKey: "svc2t" as const, groupKey: "svc2g" as const, id: "meds",     seed: 22 },
  { titleKey: "svc3t" as const, groupKey: "svc3g" as const, id: "anxiety",  seed: 33 },
  { titleKey: "svc4t" as const, groupKey: "svc4g" as const, id: "assess",   seed: 44 },
  { titleKey: "svc5t" as const, groupKey: "svc5g" as const, id: "therapy",  seed: 55 },
  { titleKey: "svc6t" as const, groupKey: "svc6g" as const, id: "wellness", seed: 66 },
];

export function ServicesSection({ serviceImages = {} }: { serviceImages?: Record<string, string | undefined> }) {
  const { t } = useLang();

  return (
    <section
      id="services"
      style={{ maxWidth: 1200, margin: "0 auto", padding: "70px 28px 40px" }}
    >
      <div style={{ maxWidth: 640, marginBottom: 40 }}>
        <h2
          style={{
            fontFamily: "var(--font-heading), serif",
            fontWeight: 500,
            fontSize: "clamp(32px,4vw,46px)",
            letterSpacing: "-0.02em",
            margin: "12px 0 14px",
            lineHeight: 1.05,
          }}
        >
          {t.svc_pre}
          <em style={{ fontStyle: "italic", fontWeight: 400 }}>{t.svc_em}</em>
          {t.svc_post}
        </h2>
        <p style={{ fontSize: 17, color: "var(--color-text-muted)", lineHeight: 1.6, margin: 0 }}>
          {t.svc_intro}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 22,
        }}
      >
        {SERVICES.map(({ titleKey, groupKey, id, seed }) => (
          <a
            key={id}
            href={`/services/${id}`}
            className="svc-card"
            style={{
              display: "flex",
              flexDirection: "column",
              borderRadius: 24,
              overflow: "hidden",
              textDecoration: "none",
              color: "inherit",
              background: "var(--color-surface)",
              boxShadow: "0 18px 50px -30px rgba(23,42,58,0.4)",
            }}
          >
            {/* Service photo */}
            <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="svc-img"
                src={serviceImages[id] ?? `https://picsum.photos/seed/${seed}/400/300`}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>

            <div
              style={{
                padding: "28px 26px 22px",
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-sans), sans-serif",
                  fontWeight: 800,
                  fontSize: 23,
                  lineHeight: 1.16,
                  letterSpacing: "-0.01em",
                  color: "var(--color-text)",
                  margin: 0,
                }}
              >
                {t[titleKey]}
              </h3>
              <div style={{ flex: 1, minHeight: 26 }} />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    padding: "8px 16px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.7)",
                    fontSize: 13,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    color: "var(--color-brand)",
                  }}
                >
                  {t[groupKey]}
                </span>
                <span className="svc-arrow">
                  <ArrowRight size={22} strokeWidth={2.2} color="var(--color-brand)" />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
