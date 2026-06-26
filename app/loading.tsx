export default function Loading() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--color-bg)" }}>
      <div
        aria-label="Loading"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "3px solid var(--color-surface)",
          borderTopColor: "var(--color-brand)",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  )
}
