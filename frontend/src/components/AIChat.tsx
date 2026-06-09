"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "Which exchange has the lowest fees for a $5,000 BTC trade?",
  "I'm in the US — what's the best exchange for me?",
  "Ledger or Trezor — which should I buy?",
  "What's the cheapest crypto tax software?",
  "Which VPN is best for crypto traders?",
  "How do I set up a trading bot for beginners?",
];

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center", padding: "10px 0" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} className="typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
    </div>
  );
}

function MessageBubble({ message, isStreaming }: { message: Message; isStreaming?: boolean }) {
  const isUser = message.role === "user";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        gap: "10px",
        alignItems: "flex-start",
        animation: "fadeUp .3s ease both",
      }}
    >
      <div
        style={{
          width: "30px",
          height: "30px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          fontWeight: 700,
          fontFamily: "var(--font-mono)",
          background: isUser
            ? "linear-gradient(135deg, #B026FF, #7A1AFF)"
            : "linear-gradient(135deg, #00F0FF, #00B4FF)",
          color: "#04060B",
          borderRadius: "999px",
          letterSpacing: ".05em",
          boxShadow: isUser
            ? "0 0 14px rgba(176, 38, 255, 0.55)"
            : "0 0 14px rgba(0, 240, 255, 0.55)",
        }}
      >
        {isUser ? "YOU" : "AI"}
      </div>

      <div
        className={isUser ? "msg-bubble-user" : "msg-bubble-ai"}
        style={{ position: "relative", whiteSpace: "pre-wrap" }}
      >
        {message.content}
        {isStreaming && <span className="caret" style={{ marginLeft: 3 }} />}
      </div>
    </div>
  );
}

interface AIChatProps {
  compact?: boolean;
  initialMessage?: string;
  placeholder?: string;
}

export function AIChat({ compact = false, placeholder = "Ask anything about crypto…" }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, streamingContent, scrollToBottom]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    setShowSuggestions(false);
    const userMessage: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setStreamingContent("");

    try {
      const response = await fetch("/api/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("API error");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      let fullContent = "";
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || ""; // keep last partial event in buffer
        for (const evt of events) {
          const line = evt.split("\n").find((l) => l.startsWith("data: "));
          if (!line) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "delta" && typeof parsed.text === "string") {
              fullContent += parsed.text;
              setStreamingContent(fullContent);
            } else if (parsed.type === "error") {
              fullContent += `\n\n_⚠ ${parsed.message || "AI service error"}_`;
              setStreamingContent(fullContent);
            }
          } catch {
            /* ignore malformed chunk */
          }
        }
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fullContent || "AI service returned no content. Please try again." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error — could not reach the AI advisor. Please try again in a moment." },
      ]);
    } finally {
      setIsLoading(false);
      setStreamingContent("");
      inputRef.current?.focus();
    }
  }, [messages, isLoading]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div
      data-testid="ai-chat-widget"
      style={{
        display: "flex",
        flexDirection: "column",
        height: compact ? "460px" : "600px",
        background: "linear-gradient(180deg, rgba(11, 14, 24, 0.95), rgba(5, 6, 10, 0.95))",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid var(--wire)",
        borderRadius: "16px",
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 0 0 1px rgba(0, 240, 255, 0.18), 0 24px 60px rgba(0, 0, 0, 0.55), 0 0 48px rgba(0, 240, 255, 0.15)",
      }}
    >
      {/* Subtle gradient glow border */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "16px",
          padding: 1,
          background: "linear-gradient(135deg, rgba(0, 240, 255, 0.4), transparent 40%, rgba(176, 38, 255, 0.4))",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
        }}
      />

      {/* Terminal header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid var(--wire)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexShrink: 0,
          background: "rgba(5, 6, 10, 0.7)",
          color: "var(--paper)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", gap: "6px" }}>
          <span style={{ width: 9, height: 9, background: "#FF3D71", borderRadius: 999, boxShadow: "0 0 8px #FF3D71" }} />
          <span style={{ width: 9, height: 9, background: "#FFC93C", borderRadius: 999, boxShadow: "0 0 8px #FFC93C" }} />
          <span style={{ width: 9, height: 9, background: "#00FF94", borderRadius: 999, boxShadow: "0 0 8px #00FF94" }} />
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--chrome)" }}>
          <span style={{ color: "#00F0FF" }}>/</span> AI ADVISOR · TERMINAL
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            padding: "3px 10px",
            background: "rgba(0, 255, 148, 0.12)",
            color: "#00FF94",
            letterSpacing: ".15em",
            fontWeight: 600,
            border: "1px solid #00FF94",
            borderRadius: "999px",
            textShadow: "0 0 8px rgba(0, 255, 148, 0.5)",
          }}
        >
          ● LIVE · CLAUDE
        </span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "22px", display: "flex", flexDirection: "column", gap: "14px", background: "transparent", position: "relative", zIndex: 1 }}>
        {isEmpty && (
          <div style={{ padding: "8px 0" }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--chrome)",
                letterSpacing: ".18em",
                textTransform: "uppercase",
                marginBottom: "14px",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span className="pulse-dot" />
              <span><span style={{ color: "#00FF94" }}>READY</span> // ASK ANYTHING</span>
            </div>
            <p
              className="heading-md"
              style={{ marginBottom: "12px", fontSize: "28px", letterSpacing: "-.025em" }}
            >
              <span className="italic-serif">What&apos;s</span> the right exchange<br />for <span className="holo-text" style={{ fontWeight: 600 }}>you</span>?
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--chrome)", lineHeight: 1.6 }}>
              I know every crypto exchange, wallet, tax tool, VPN, and trading bot — and exactly which one is right for your situation.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {isLoading && streamingContent && (
          <MessageBubble message={{ role: "assistant", content: streamingContent }} isStreaming />
        )}

        {isLoading && !streamingContent && (
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <div style={{ width: "30px", height: "30px", background: "linear-gradient(135deg, #00F0FF, #00B4FF)", borderRadius: "999px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700, color: "#04060B", boxShadow: "0 0 14px rgba(0, 240, 255, 0.55)" }}>AI</div>
            <TypingDots />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {showSuggestions && isEmpty && (
        <div style={{ padding: "14px 18px 4px", flexShrink: 0, borderTop: "1px solid var(--wire)", background: "rgba(5, 6, 10, 0.45)", position: "relative", zIndex: 1 }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", letterSpacing: ".22em", textTransform: "uppercase", fontWeight: 600, marginBottom: "10px" }}>
            <span style={{ color: "#00F0FF" }}>&gt;</span> Try asking
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
            {SUGGESTED_QUESTIONS.slice(0, compact ? 3 : 6).map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                data-testid={`ai-suggested-q-${q.slice(0, 16).replace(/[^a-z]+/gi, "-").toLowerCase()}`}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--paper)",
                  padding: "7px 12px",
                  borderRadius: "999px",
                  border: "1px solid var(--wire)",
                  background: "rgba(19, 23, 38, 0.7)",
                  cursor: "pointer",
                  transition: "all .18s",
                  textAlign: "left",
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  const el = e.target as HTMLElement;
                  el.style.background = "rgba(0, 240, 255, 0.1)";
                  el.style.borderColor = "#00F0FF";
                  el.style.color = "#00F0FF";
                }}
                onMouseLeave={(e) => {
                  const el = e.target as HTMLElement;
                  el.style.background = "rgba(19, 23, 38, 0.7)";
                  el.style.borderColor = "var(--wire)";
                  el.style.color = "var(--paper)";
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div
        style={{
          padding: "14px 16px",
          borderTop: "1px solid var(--wire)",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          flexShrink: 0,
          background: "rgba(5, 6, 10, 0.65)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", color: "#00F0FF", fontWeight: 700, textShadow: "0 0 8px #00F0FF" }}>&gt;_</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          disabled={isLoading}
          data-testid="ai-chat-input"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
            color: "var(--paper)",
            caretColor: "#00F0FF",
          }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isLoading}
          data-testid="ai-chat-send"
          style={{
            width: "40px",
            height: "38px",
            borderRadius: "999px",
            background: input.trim() && !isLoading
              ? "linear-gradient(135deg, #00F0FF, #00B4FF)"
              : "rgba(19, 23, 38, 0.6)",
            border: input.trim() && !isLoading ? "1px solid #00F0FF" : "1px solid var(--wire)",
            cursor: input.trim() && !isLoading ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all .2s",
            flexShrink: 0,
            boxShadow: input.trim() && !isLoading ? "0 0 24px rgba(0, 240, 255, 0.6)" : "none",
            color: input.trim() && !isLoading ? "#04060B" : "var(--chrome)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
