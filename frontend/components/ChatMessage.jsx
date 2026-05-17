import { COLORS, FONT, SPACE, RADIUS, FF } from "../constants/tokens";
import { TOOL_LABELS } from "../constants/chat";

function ToolBadge({ tool }) {
  if (!tool) return null;
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: SPACE.xs,
      background: COLORS.accentDim,
      border: `1px solid ${COLORS.accentBorder}`,
      borderRadius: RADIUS.full,
      padding: `2px ${SPACE.sm}px`,
      fontSize: FONT.xs,
      color: COLORS.accent,
      fontFamily: FF.body,
      marginBottom: SPACE.xs,
      animation: "fadeUp 0.2s ease",
    }}>
      · {TOOL_LABELS[tool] || tool}
    </div>
  );
}

export default function ChatMessage({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div style={{
      display: "flex",
      flexDirection: isUser ? "row-reverse" : "row",
      gap: SPACE.sm,
      alignItems: "flex-end",
      marginBottom: SPACE.lg,
      animation: "fadeUp 0.3s cubic-bezier(0.34,1.3,0.64,1)",
    }}>

      {/* Avatar — agent only */}
      {!isUser && (
        <div style={{
          width: 26, height: 26, borderRadius: RADIUS.sm,
          background: COLORS.accent,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: FONT.xs, color: "#000", fontWeight: 700,
          fontFamily: FF.display, flexShrink: 0,
        }}>P</div>
      )}

      <div style={{
        maxWidth: "72%",
        display: "flex", flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
      }}>
        {msg.tool_used && <ToolBadge tool={msg.tool_used} />}

        <div style={{
          background: isUser ? COLORS.accent : COLORS.surface,
          border: isUser ? "none" : `1px solid ${COLORS.border}`,
          borderRadius: isUser
            ? `${RADIUS.lg}px ${RADIUS.lg}px ${RADIUS.sm}px ${RADIUS.lg}px`
            : `${RADIUS.lg}px ${RADIUS.lg}px ${RADIUS.lg}px ${RADIUS.sm}px`,
          padding: `${SPACE.sm + 2}px ${SPACE.md + 2}px`,
          fontSize: FONT.base,
          lineHeight: 1.65,
          color: isUser ? "#000" : COLORS.textPrimary,
          fontFamily: FF.body,
          fontWeight: isUser ? 500 : 400,
        }}>
          {msg.content}
        </div>

        {msg.escalated && (
          <div style={{
            fontSize: FONT.xs, color: COLORS.textMuted,
            fontFamily: FF.body, marginTop: SPACE.xs,
          }}>
            Passed to support team
          </div>
        )}
      </div>
    </div>
  );
}