"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { Plus } from "lucide-react";

export function FAQSection() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      style={{
        maxWidth: 820,
        margin: "0 auto",
        padding: "60px 28px 80px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h2
          style={{
            fontFamily: "var(--font-heading), serif",
            fontWeight: 500,
            fontSize: "clamp(30px,3.6vw,42px)",
            letterSpacing: "-0.02em",
            margin: 0,
            lineHeight: 1.08,
          }}
        >
          {t.faq_pre}
          <em style={{ fontStyle: "italic", fontWeight: 400 }}>{t.faq_em}</em>
          {t.faq_post}
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {t.faqList.map((item, i) => (
          <div
            key={i}
            style={{
              borderRadius: 16,
              background: open === i ? "#fff" : "var(--color-surface)",
              border: `1px solid ${open === i ? "var(--color-accent)" : "transparent"}`,
              overflow: "hidden",
              transition: "background 0.2s, border-color 0.2s",
            }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                padding: "20px 22px",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "var(--color-text)",
                  lineHeight: 1.4,
                }}
              >
                {item.q}
              </span>
              <Plus
                size={20}
                strokeWidth={2}
                color="var(--color-brand)"
                style={{
                  flexShrink: 0,
                  transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                  transition: "transform 0.25s ease",
                }}
              />
            </button>
            {open === i && (
              <div
                style={{
                  padding: "0 22px 20px",
                  fontSize: 15.5,
                  lineHeight: 1.65,
                  color: "var(--color-text-muted)",
                  animation: "fadeUp 0.2s ease both",
                }}
              >
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
