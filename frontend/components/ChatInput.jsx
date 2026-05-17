import { useState, useRef } from "react";
import { COLORS, FONT, SPACE, RADIUS, FF, TRANSITION } from "../constants/tokens";

export default function ChatInput({ onSend, loading }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!value.trim() || loading) return;
    onSend(value.trim());
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim() && !loading;

  return (
    <div style={{ padding: `${SPACE.md}px ${SPACE.xl}px ${SPACE.xl}px` }}>
      <div style={{
        display: "flex", alignItems: "flex-end", gap: SPACE.sm,
        background: COLORS.surface,
        border: `1px solid ${focused ? COLORS.borderLight : COLORS.border}`,
        borderRadius: RADIUS.lg,
        padding: `${SPACE.sm + 2}px ${SPACE.sm + 2}px ${SPACE.sm + 2}px ${SPACE.md + 4}px`,
        transition: TRANSITION.fast,
      }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onInput={e => {
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
          }}
          placeholder="Ask about products, orders, returns..."
          rows={1}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            color: COLORS.textPrimary, fontSize: FONT.base,
            fontFamily: FF.body, lineHeight: 1.6, resize: "none",
            maxHeight: 120, overflowY: "auto",
          }}
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          style={{
            width: 34, height: 34, borderRadius: RADIUS.sm, border: "none",
            background: canSend ? COLORS.accent : COLORS.border,
            color: canSend ? "#000" : COLORS.textMuted,
            cursor: canSend ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: FONT.base, flexShrink: 0,
            transition: TRANSITION.fast,
            fontWeight: 700,
          }}
        >
          {loading ? (
            <div style={{
              width: 12, height: 12,
              border: `2px solid ${COLORS.textMuted}`,
              borderTopColor: COLORS.textPrimary,
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }} />
          ) : "↑"}
        </button>
      </div>

      <p style={{
        textAlign: "center", marginTop: SPACE.sm,
        fontFamily: FF.body, fontSize: FONT.xs, color: COLORS.textMuted,
      }}>
        PocketTech AI · Powered by Claude
      </p>
    </div>
  );
}