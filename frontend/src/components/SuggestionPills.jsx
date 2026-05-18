import styles from "./SuggestionPills.module.css";
import { SUGGESTIONS } from "../constants/chat";

export default function SuggestionPills({ onSelect }) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>Quick actions</p>
      <div className={styles.pills}>
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            className={styles.pill}
            onClick={() => onSelect(s.message)}
          >
            <span>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}