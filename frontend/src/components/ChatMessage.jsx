import styles from "./ChatMessage.module.css";
import { TOOL_LABELS } from "../constants/chat";

function ToolBadge({ tool }) {
  if (!tool) return null;
  return (
    <div className={styles.toolBadge}>
      · {TOOL_LABELS[tool] || tool}
    </div>
  );
}

export default function ChatMessage({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div className={`${styles.wrapper} ${isUser ? styles.wrapperUser : ""}`}>

      {!isUser && <div className={styles.avatar}>P</div>}

      <div className={`${styles.bubbleGroup} ${isUser ? styles.bubbleGroupUser : styles.bubbleGroupAgent}`}>
        {msg.tool_used && <ToolBadge tool={msg.tool_used} />}

        <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleAgent}`}>
          {msg.content}
        </div>

        {msg.escalated && (
          <p className={styles.escalationNote}>Passed to support team</p>
        )}
      </div>

    </div>
  );
}