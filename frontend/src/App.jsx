import { useRef, useEffect } from "react";
import { COLORS, FF, FONT, SPACE } from "../constants/tokens";
import { useChat } from "../hooks/UseChat";
import LeftPanel from "../components/LeftPanel";
import ChatMessage from "../components/ChatMessage";
import TypingIndicator from "../components/TypingIndicator";
import SuggestionPills from "../components/SuggestionPills";
import ChatInput from "../components/ChatInput";

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${COLORS.bg}; }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 2px; }

  textarea { resize: none; font-family: inherit; }
  button { font-family: inherit; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-8px); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }
  @keyframes typingDot {
    0%, 60%, 100% { transform: translateY(0);  opacity: 0.3; }
    30%           { transform: translateY(-4px); opacity: 1; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function App() {
  const { messages, loading, sendMessage, isFirstMessage } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <LeftPanel />

        {/* Chat panel */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          background: COLORS.bg, overflow: "hidden",
        }}>

          {/* Header */}
          <div style={{
            padding: `${SPACE.lg}px ${SPACE.xl}px`,
            borderBottom: `1px solid ${COLORS.border}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <h1 style={{
                fontFamily: FF.display, fontSize: FONT.lg,
                color: COLORS.textPrimary, fontWeight: 400,
              }}>
                Support
              </h1>
              <p style={{
                fontFamily: FF.body, fontSize: FONT.xs,
                color: COLORS.textMuted, marginTop: 2,
              }}>
                AI-powered · Instant answers
              </p>
            </div>
            <div style={{
              fontFamily: FF.body, fontSize: FONT.xs,
              color: COLORS.textMuted,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 999, padding: `4px ${SPACE.md}px`,
            }}>
              claude-sonnet
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto",
            padding: `${SPACE.xl}px ${SPACE.xl}px 0`,
          }}>
            {isFirstMessage && (
              <div style={{ marginBottom: SPACE.xxl, animation: "fadeUp 0.4s ease" }}>
                <p style={{
                  fontFamily: FF.display, fontSize: FONT["2xl"],
                  color: COLORS.textPrimary, fontWeight: 400,
                  lineHeight: 1.3, marginBottom: SPACE.sm,
                }}>
                  How can I help?
                </p>
                <p style={{
                  fontFamily: FF.body, fontSize: FONT.base,
                  color: COLORS.textSecondary, lineHeight: 1.6,
                }}>
                  Ask about any product, track an order, or start a return.
                </p>
              </div>
            )}

            {isFirstMessage && <SuggestionPills onSelect={sendMessage} />}

            {messages.map((msg, i) => (
              <ChatMessage key={i} msg={msg} />
            ))}

            {loading && <TypingIndicator />}
            <div ref={bottomRef} style={{ height: SPACE.xl }} />
          </div>

          <ChatInput onSend={sendMessage} loading={loading} />
        </div>
      </div>
    </>
  );
}