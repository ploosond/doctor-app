"use client";

import { useLang } from "@/lib/i18n";
import { CalendarDays } from "lucide-react";

export function BookingSection() {
  const { t } = useLang();

  return (
    <section id="booking" style={{ padding: "58px 28px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 36 }}>
          <h2
            style={{
              fontFamily: "var(--font-heading), serif",
              fontWeight: 500,
              fontSize: "clamp(30px,3.8vw,44px)",
              letterSpacing: "-0.02em",
              margin: "0 0 10px",
              lineHeight: 1.06,
              color: "var(--color-text)",
            }}
          >
            {t.book_pre}
            <em style={{ fontStyle: "italic", fontWeight: 400 }}>{t.book_em}</em>
            {t.book_post}
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--color-text-muted)",
              margin: 0,
              lineHeight: 1.6,
              maxWidth: 520,
            }}
          >
            {t.book_intro}
          </p>
        </div>

        {/* Placeholder card */}
        <div
          style={{
            borderRadius: 28,
            background:
              "radial-gradient(58% 52% at 100% 0%, rgba(116,179,206,.35), transparent 55%), var(--color-surface)",
            border: "1px solid var(--color-accent)",
            padding: "80px 40px",
            textAlign: "center",
            boxShadow: "0 40px 90px -40px rgba(23,42,58,0.2)",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "var(--color-brand)",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 24px",
            }}
          >
            <CalendarDays size={32} color="#fff" strokeWidth={1.8} />
          </div>
          <h3
            style={{
              fontFamily: "var(--font-heading), serif",
              fontSize: 28,
              fontWeight: 500,
              color: "var(--color-text)",
              margin: "0 0 12px",
            }}
          >
            Booking coming soon
          </h3>
          <p
            style={{
              fontSize: 16,
              color: "var(--color-text-muted)",
              maxWidth: 420,
              margin: "0 auto 28px",
              lineHeight: 1.6,
            }}
          >
            {t.book_intro}
          </p>
          <a
            href="#contact"
            className="btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              color: "#fff",
              fontWeight: 600,
              fontSize: 15,
              padding: "14px 28px",
              borderRadius: 999,
              background: "var(--color-brand)",
            }}
          >
            {t.call_today}
          </a>
        </div>
      </div>
    </section>
  );
}
