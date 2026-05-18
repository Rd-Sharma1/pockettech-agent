import { useState, useRef } from "react";
import styles from "./ChatInput.module.css";

export default function ChatInput({ onSend, loading }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);
  const canSend = value.trim() && !loading;

  const handleSend = () => {
    if (!canSend) return;
    onSend(value.trim());
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputRow}>
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKey}
          onInput={handleInput}
          placeholder="Ask about products, orders, returns..."
          className={styles.textarea}
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`${styles.sendBtn} ${canSend ? styles.active : styles.inactive}`}
        >
          {loading
            ? <div className={styles.spinner} />
            : "↑"
          }
        </button>
      </div>
      <p className={styles.footer}>PocketTech AI · Powered by Claude</p>
    </div>
  );
}