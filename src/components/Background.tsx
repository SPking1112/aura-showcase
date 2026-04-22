export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="blob"
        style={{
          width: 480,
          height: 480,
          top: "-10%",
          left: "-10%",
          background: "var(--gradient-primary)",
        }}
      />
      <div
        className="blob"
        style={{
          width: 520,
          height: 520,
          bottom: "-15%",
          right: "-10%",
          background: "var(--gradient-accent)",
          animationDelay: "-7s",
        }}
      />
      <div
        className="blob"
        style={{
          width: 360,
          height: 360,
          top: "40%",
          left: "55%",
          background: "linear-gradient(135deg, var(--accent), var(--primary-glow))",
          animationDelay: "-3s",
          opacity: 0.35,
        }}
      />
    </div>
  );
}
