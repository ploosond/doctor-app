import { ServiceForm } from "./ServiceForm"
import { createService } from "../actions"

export default function NewServicePage() {
  return (
    <div style={{ padding: "36px 40px", maxWidth: 800 }}>
      <h1
        style={{
          fontFamily: "var(--font-heading), serif",
          fontWeight: 500,
          fontSize: 26,
          letterSpacing: "-0.01em",
          color: "var(--color-text)",
          margin: "0 0 28px",
        }}
      >
        New service
      </h1>
      <ServiceForm action={createService} />
    </div>
  )
}
