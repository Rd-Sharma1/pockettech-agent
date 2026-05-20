import { useRef, useEffect } from "react";
import "./styles/global.css";
import styles from "./App.module.css";
import { useChat } from "./hooks/UseChat";
import LeftPanel from "./components/LeftPanel";
import ChatMessage from "./components/ChatMessage";
import TypingIndicator from "./components/TypingIndicator";
import SuggestionPills from "./components/SuggestionPills";
import ChatInput from "./components/ChatInput";

export default function App() {
  const { messages, loading, sendMessage, isFirstMessage } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className={styles.layout}>
      <LeftPanel />

      <div className={styles.chatPanel}>

        <header className={styles.header}>
          <div>
            <h1 className={styles.headerTitle}>Support</h1>
            <p className={styles.headerSub}>AI-powered · Instant answers</p>
          </div>
          <span className={styles.modelBadge}>Groq-AI</span>
        </header>

        <div className={styles.messages}>
          {isFirstMessage && (
            <div className={styles.greeting}>
              <h2 className={styles.greetingTitle}>How can I help?</h2>
              <p className={styles.greetingSub}>
                Ask about any product, track an order, or start a return.
              </p>
            </div>
          )}

          {isFirstMessage && <SuggestionPills onSelect={sendMessage} />}

          {messages.map((msg, i) => (
            <ChatMessage key={i} msg={msg} />
          ))}

          {loading && <TypingIndicator />}
          <div ref={bottomRef} className={styles.scrollAnchor} />
        </div>

        <ChatInput onSend={sendMessage} loading={loading} />
      </div>
    </div>
  );
}