import { COLORS, FONT, SPACE, RADIUS } from "../constants/tokens";

export default function TypingIndicator() {
  return (
    <div style={{
      display: "flex", gap: SPACE.sm,
      alignItems: "flex-end", marginBottom: SPACE.lg,
      animation: "fadeUp 0.25s ease",
    }}>
      {/* Avatar */}
      <div style={{
        width: 26, height: 26, borderRadius: RADIUS.sm,
        background: COLORS.accent,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: FONT.xs, color: "#000", fontWeight: 700,
        fontFamily: "'Instrument Serif', Georgia, serif", flexShrink: 0,
      }}>P</div>

      <div style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: `${RADIUS.lg}px ${RADIUS.lg}px ${RADIUS.lg}px ${RADIUS.sm}px`,
        padding: `${SPACE.sm + 2}px ${SPACE.md + 2}px`,
        display: "flex", alignItems: "center", gap: SPACE.sm,
      }}>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              width: 5, height: 5, borderRadius: "50%",
              background: COLORS.textMuted,
              display: "inline-block",
              animation: `typingDot 1.3s ease-in-out ${i * 0.18}s infinite`,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}