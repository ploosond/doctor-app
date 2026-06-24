"use client";

import { useLang } from "@/lib/i18n";
import { Phone } from "lucide-react";

export function ContactSection() {
  const { t } = useLang();

  return (
    <section
      id="contact"
      style={{
        width: "100%",
        background: "var(--color-surface)",
        padding: "80px 28px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "center",
        }}
      >
        {/* Left */}
        <div>
          <h2
            style={{
              fontFamily: "var(--font-heading), serif",
              fontWeight: 400,
              fontSize: "clamp(30px,3.8vw,46px)",
              letterSpacing: "-0.02em",
              color: "var(--color-text)",
              margin: "0 0 20px",
              lineHeight: 1.1,
            }}
          >
            {t.contact_head}
          </h2>
          <p
            style={{
              fontSize: 16.5,
              color: "var(--color-text-muted)",
              lineHeight: 1.65,
              margin: "0 0 36px",
              maxWidth: 460,
            }}
          >
            {t.contact_intro}
          </p>
          <a
            href="tel:+97714000000"
            className="btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              padding: "16px 32px",
              borderRadius: 999,
              background: "var(--color-brand)",
            }}
          >
            <Phone size={18} strokeWidth={2} />
            {t.call_today}
          </a>
        </div>

        {/* Right: clinic photo */}
        <div style={{ borderRadius: 22, overflow: "hidden", aspectRatio: "4/3" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://picsum.photos/seed/77/600/450"
            alt="Clinic"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      </div>
    </section>
  );
}
