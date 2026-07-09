/**
 * app/dashboard/ai-coach/page.tsx
 *
 * AI Coach — chat interface with suggested prompts and typing indicator.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ChatBubble } from "@/components/dashboard/ChatBubble";
import { PLACEHOLDER_CHAT_MESSAGES, SUGGESTED_PROMPTS } from "@/lib/data/placeholder";
import type { ChatMessage } from "@/types/dashboard";

export default function AICoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(PLACEHOLDER_CHAT_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function handleSend(text?: string) {
    const content = (text ?? input).trim();
    if (!content) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI typing delay — TODO Stage 2: replace with Gemini API call
    setTimeout(() => {
      setIsTyping(false);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        content:
          "That's a great question! I'll help you work through this. For now, I'm in demo mode — in Stage 2 I'll be powered by **Gemini AI** to give you personalised, real-time coaching. Stay tuned! 🚀",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1800);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-68px-48px)] gap-4">
      <PageHeader
        title="AI Career Coach"
        subtitle="Your always-on AI mentor. Ask anything about your career journey."
      />

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        {/* Chat panel */}
        <div
          className="flex flex-col flex-1 rounded-2xl overflow-hidden"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {/* Chat header */}
          <div
            className="flex items-center gap-3 px-5 py-3.5 border-b"
            style={{ borderColor: "var(--color-border-light)" }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--color-rose-gold)", color: "#fff" }}
              aria-hidden="true"
            >
              <Bot className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--color-puce-red)", fontFamily: "var(--font-heading)" }}>
                Herizon AI Coach
              </p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
                <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>Online · Powered by Gemini AI</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4"
            role="list"
            aria-label="Chat messages"
            aria-live="polite"
          >
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="flex items-center gap-3"
                  aria-label="AI is typing"
                  aria-live="assertive"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: "var(--color-rose-gold)", color: "#fff" }}
                    aria-hidden="true"
                  >
                    AI
                  </div>
                  <div
                    className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-tl-none"
                    style={{ background: "var(--color-surface-hover)", border: "1px solid var(--color-border)" }}
                  >
                    {[0, 0.2, 0.4].map((delay) => (
                      <motion.span
                        key={delay}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--color-text-muted)" }}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay }}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="px-4 py-3 border-t"
            style={{ borderColor: "var(--color-border-light)" }}
          >
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your AI coach anything…"
                className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none"
                style={{
                  background: "var(--color-surface-hover)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-body)",
                }}
                aria-label="Message input"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-150"
                style={{
                  background: input.trim() && !isTyping ? "var(--color-rose-gold)" : "var(--color-border)",
                  color: input.trim() && !isTyping ? "#fff" : "var(--color-text-muted)",
                }}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>

        {/* Suggested prompts sidebar */}
        <div
          className="lg:w-64 flex flex-col rounded-2xl overflow-hidden flex-shrink-0"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div
            className="px-4 py-3.5 border-b"
            style={{ borderColor: "var(--color-border-light)" }}
          >
            <p className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "var(--color-puce-red)", fontFamily: "var(--font-heading)" }}>
              <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--color-rose-gold)" }} aria-hidden="true" />
              Suggested Prompts
            </p>
          </div>
          <div className="flex flex-row lg:flex-col gap-2 p-3 overflow-x-auto lg:overflow-y-auto">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSend(prompt)}
                disabled={isTyping}
                className="flex-shrink-0 text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150"
                style={{
                  background: "var(--color-surface-hover)",
                  border: "1px solid var(--color-border-light)",
                  color: "var(--color-text-secondary)",
                  minWidth: "160px",
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
