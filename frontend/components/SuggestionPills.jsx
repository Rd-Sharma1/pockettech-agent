import { useState } from "react";
import { COLORS, FONT, SPACE, RADIUS, FF, TRANSITION } from "../constants/tokens";
import { SUGGESTIONS } from "../constants/chat";

export default function SuggestionPills({ onSelect }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ marginBottom: SPACE.xl, animation: "fadeUp 0.4s ease 0.2s both" }}>
      <p style={{
        fontFamily: FF.body, fontSize: FONT.xs,
        color: COLORS.textMuted, letterSpacing: "0.08em",
        textTransform: "uppercase", marginBottom: SPACE.md,
      }}>
        Quick actions
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: SPACE.sm }}>
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            onClick={() => onSelect(s.message)}
            onMouseEnter={() => setHovered(s.label)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "flex", alignItems: "center", gap: SPACE.sm,
              background: hovered === s.label ? COLORS.accentDim : COLORS.surface,
              border: `1px solid ${hovered === s.label ? COLORS.accentBorder : COLORS.border}`,
              borderRadius: RADIUS.full,
              padding: `${SPACE.sm}px ${SPACE.md + 2}px`,
              fontSize: FONT.sm,
              color: hovered === s.label ? COLORS.accent : COLORS.textSecondary,
              fontFamily: FF.body,
              cursor: "pointer",
              transition: TRANSITION.fast,
            }}
          >
            <span style={{ fontSize: FONT.sm }}>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}