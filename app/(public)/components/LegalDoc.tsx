import { Nav } from "./Nav"
import { Footer } from "./Footer"

export type LegalSection = { h: string; p: string[] }

export function LegalDoc({
  title,
  updated,
  intro,
  sections,
}: {
  title: string
  updated: string
  intro: string
  sections: LegalSection[]
}) {
  return (
    <main>
      <Nav />
      <article
        className="section-container"
        style={{ maxWidth: 780, margin: "0 auto", padding: "clamp(96px,14vw,140px) 0 clamp(40px,8vw,80px)" }}
      >
        <h1
          style={{
            fontFamily: "var(--font-heading), serif",
            fontWeight: 500,
            fontSize: "clamp(32px,4.5vw,48px)",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            color: "var(--color-text)",
            margin: "0 0 10px",
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: 14, color: "var(--color-text-muted)", margin: "0 0 28px" }}>{updated}</p>
        <p style={{ fontSize: 17, color: "var(--color-text)", lineHeight: 1.7, margin: "0 0 32px" }}>{intro}</p>

        {sections.map((s, i) => (
          <section key={i} style={{ marginBottom: 28 }}>
            <h2
              style={{
                fontFamily: "var(--font-sans), sans-serif",
                fontWeight: 700,
                fontSize: 19,
                color: "var(--color-text)",
                margin: "0 0 10px",
              }}
            >
              {`${i + 1}. ${s.h}`}
            </h2>
            {s.p.map((para, j) => (
              <p key={j} style={{ fontSize: 16, color: "var(--color-text-muted)", lineHeight: 1.7, margin: "0 0 10px" }}>
                {para}
              </p>
            ))}
          </section>
        ))}
      </article>
      <Footer />
    </main>
  )
}
