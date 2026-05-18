import { useState } from "react";
import { INITIAL_MESSAGE } from "../constants/chat";

const API_URL = "http://localhost:8000/api/chat";

export function useChat() {
  const [messages, setMessages]   = useState([INITIAL_MESSAGE]);
  const [loading, setLoading]     = useState(false);
  const [history, setHistory]     = useState([]);
  const [sessionId, setSessionId] = useState(null);

  const sendMessage = async (text) => {
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const nextHistory = [...history, { role: "user", content: text }];

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversation_history: history,
          session_id: sessionId,
        }),
      });

      const data = await res.json();
      setSessionId(data.session_id);
      setHistory([...nextHistory, { role: "assistant", content: data.reply }]);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.reply,
        tool_used: data.tool_used,
        escalated: data.escalated,
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const isFirstMessage = messages.length <= 1;

  return { messages, loading, sendMessage, isFirstMessage };
}