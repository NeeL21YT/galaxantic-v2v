/**
 * app/dashboard/ai-coach/page.tsx
 *
 * AI Coach - chat interface with suggested prompts and typing indicator.
 */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, Sparkles, Plus, Pencil, Trash2, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ChatBubble } from "@/components/dashboard/ChatBubble";
import { Button } from "@/components/ui/Button";
import { SUGGESTED_PROMPTS } from "@/lib/data/placeholder";
import type { ChatMessage } from "@/types/dashboard";
import {
  deleteConversationAction,
  loadConversationAction,
  loadConversationsAction,
  renameConversationAction,
  sendMessageAction,
} from "./actions";
import type { CoachConversationSummary } from "./actions";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  sender: "ai",
  content:
    "Hi! I'm Herizon AI. I can help with resume feedback, interview prep, learning plans, career breaks, and opportunities using your Herizon profile and resume context.",
  timestamp: new Date().toISOString(),
};

const LOADING_STATES = ["Thinking...", "Analyzing...", "Generating response..."];

export default function AICoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [conversations, setConversations] = useState<CoachConversationSummary[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [deleteModalConversationId, setDeleteModalConversationId] = useState<string | null>(null);
  const [renameModalConversation, setRenameModalConversation] = useState<CoachConversationSummary | null>(null);
  const [renameInputValue, setRenameInputValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isTyping) return;

    const timer = window.setInterval(() => {
      setLoadingIndex((current) => (current + 1) % LOADING_STATES.length);
    }, 1200);

    return () => window.clearInterval(timer);
  }, [isTyping]);

  const refreshConversations = useCallback(async () => {
    const loaded = await loadConversationsAction();
    setConversations(loaded);
    return loaded;
  }, []);

  const loadConversation = useCallback(async (conversationId: string) => {
    setError(null);
    const result = await loadConversationAction(conversationId);
    if (!result.success) {
      setError(result.error);
      return;
    }

    setActiveConversationId(result.data.conversation.id);
    setMessages(result.data.messages.length > 0 ? result.data.messages : [WELCOME_MESSAGE]);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialState() {
      setIsLoadingConversations(true);
      const loaded = await loadConversationsAction();
      if (cancelled) return;

      setConversations(loaded);
      setIsLoadingConversations(false);

      if (loaded[0]) {
        await loadConversation(loaded[0].id);
      }
    }

    loadInitialState();

    return () => {
      cancelled = true;
    };
  }, [loadConversation]);

  async function handleSend(text?: string) {
    const content = (text ?? input).trim();
    if (!content || isTyping) return;

    const tempUserMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      sender: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setError(null);
    setMessages((prev) => [...prev.filter((msg) => msg.id !== "welcome"), tempUserMessage]);
    setInput("");
    setLoadingIndex(0);
    setIsTyping(true);

    const result = await sendMessageAction({
      conversationId: activeConversationId,
      message: content,
    });

    setIsTyping(false);
    setLoadingIndex(0);

    if (!result.success) {
      setError(result.error);
      if (result.conversation) {
        setActiveConversationId(result.conversation.id);
      }
      if (result.userMessage) {
        setMessages((prev) => prev.map((msg) => (msg.id === tempUserMessage.id ? result.userMessage! : msg)));
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: "ai",
          content: result.error,
          timestamp: new Date().toISOString(),
        },
      ]);
      await refreshConversations();
      inputRef.current?.focus();
      return;
    }

    // Force switch to the correct conversation just in case
    setActiveConversationId(result.conversation.id);
    
    // Completely replace the messages with the server's absolute truth
    // to prevent any race conditions merging previous chat messages
    setMessages([WELCOME_MESSAGE, ...result.messages]);
    
    await refreshConversations();
    inputRef.current?.focus();
  }

  function startNewConversation() {
    setActiveConversationId(null);
    setMessages([WELCOME_MESSAGE]);
    setInput("");
    setError(null);
    inputRef.current?.focus();
  }

  function openRenameModal(conversation: CoachConversationSummary) {
    setRenameModalConversation(conversation);
    setRenameInputValue(conversation.title);
  }

  async function handleRename() {
    if (!renameModalConversation || !renameInputValue.trim() || renameInputValue.trim() === renameModalConversation.title) {
      setRenameModalConversation(null);
      return;
    }

    const result = await renameConversationAction(renameModalConversation.id, renameInputValue.trim());
    if (!result.success) {
      setError(result.error);
    } else {
      setConversations((prev) =>
        prev.map((item) => (item.id === renameModalConversation.id ? result.conversation : item))
      );
    }
    setRenameModalConversation(null);
  }

  function openDeleteModal(conversationId: string) {
    setDeleteModalConversationId(conversationId);
  }

  async function handleDelete() {
    if (!deleteModalConversationId) return;
    const conversationId = deleteModalConversationId;
    setDeleteModalConversationId(null);

    const result = await deleteConversationAction(conversationId);
    if (!result.success) {
      setError(result.error);
      return;
    }

    const remaining = conversations.filter((item) => item.id !== conversationId);
    setConversations(remaining);

    if (activeConversationId === conversationId) {
      if (remaining[0]) {
        await loadConversation(remaining[0].id);
      } else {
        startNewConversation();
      }
    }
  }

  function formatConversationTime(value: string) {
    try {
      return new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });
    } catch {
      return "";
    }
  }

  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId);

  return (
    <>
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
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "var(--color-puce-red)", fontFamily: "var(--font-heading)" }}>
                {activeConversation?.title ?? "Herizon AI Coach"}
              </p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
                <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>Online · Powered by Herizon AI</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4"
            role="list"
            aria-label="Chat messages"
            aria-live="polite"
            aria-busy={isTyping}
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
                  aria-label={LOADING_STATES[loadingIndex]}
                  aria-live="assertive"
                  role="status"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: "var(--color-rose-gold)", color: "#fff" }}
                    aria-hidden="true"
                  >
                    AI
                  </div>
                  <div
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl rounded-tl-none"
                    style={{ background: "var(--color-surface-hover)", border: "1px solid var(--color-border)" }}
                  >
                    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {LOADING_STATES[loadingIndex]}
                    </span>
                    <span className="flex items-center gap-1" aria-hidden="true">
                      {[0, 0.2, 0.4].map((delay) => (
                        <motion.span
                          key={delay}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: "var(--color-text-muted)" }}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay }}
                        />
                      ))}
                    </span>
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
            {error && (
              <p className="mb-2 text-xs" style={{ color: "var(--color-puce-red)" }} role="alert">
                {error}
              </p>
            )}
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your AI coach anything..."
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
          className="lg:w-72 flex flex-col rounded-2xl overflow-hidden flex-shrink-0"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div
            className="px-4 py-3.5 border-b flex items-center justify-between gap-2"
            style={{ borderColor: "var(--color-border-light)" }}
          >
            <p className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "var(--color-puce-red)", fontFamily: "var(--font-heading)" }}>
              <MessageSquare className="w-3.5 h-3.5" style={{ color: "var(--color-rose-gold)" }} aria-hidden="true" />
              Conversations
            </p>
            <button
              type="button"
              onClick={startNewConversation}
              disabled={isTyping}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150"
              style={{ background: "var(--color-surface-hover)", color: "var(--color-rackley)" }}
              aria-label="Start new conversation"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="max-h-44 overflow-y-auto p-3">
            {isLoadingConversations ? (
              <p className="text-xs px-2 py-3" style={{ color: "var(--color-text-muted)" }}>
                Loading conversations...
              </p>
            ) : conversations.length === 0 ? (
              <p className="text-xs px-2 py-3" style={{ color: "var(--color-text-muted)" }}>
                No saved chats yet.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="group flex items-center gap-1 rounded-xl px-2 py-2 transition-all duration-150"
                    style={{
                      background: conversation.id === activeConversationId
                        ? "rgba(180,108,114,0.12)"
                        : "var(--color-surface-hover)",
                      border: "1px solid var(--color-border-light)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => loadConversation(conversation.id)}
                      disabled={isTyping}
                      className="min-w-0 flex-1 text-left"
                      aria-label={`Load conversation ${conversation.title}`}
                    >
                      <span className="block truncate text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
                        {conversation.title}
                      </span>
                      <span className="block text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                        {formatConversationTime(conversation.updatedAt)}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openRenameModal(conversation)}
                      disabled={isTyping}
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ color: "var(--color-text-muted)" }}
                      aria-label={`Rename ${conversation.title}`}
                    >
                      <Pencil className="w-3 h-3" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteModal(conversation.id)}
                      disabled={isTyping}
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ color: "var(--color-text-muted)" }}
                      aria-label={`Delete ${conversation.title}`}
                    >
                      <Trash2 className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className="px-4 py-3.5 border-y"
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

      {/* ── Custom Rename Modal ── */}
      <AnimatePresence>
        {renameModalConversation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full border border-red-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rename Conversation</h3>
              <input
                type="text"
                value={renameInputValue}
                onChange={(e) => setRenameInputValue(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename();
                  if (e.key === "Escape") setRenameModalConversation(null);
                }}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-6 outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all"
              />
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setRenameModalConversation(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="bg-red-500 hover:bg-red-600 text-white border-transparent"
                  onClick={handleRename}
                >
                  Save
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Custom Delete Modal ── */}
      <AnimatePresence>
        {deleteModalConversationId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full border border-red-100"
            >
              <h3 className="text-lg font-semibold text-red-600 mb-2">Delete Conversation?</h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Are you sure you want to delete this conversation? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setDeleteModalConversationId(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="bg-red-500 hover:bg-red-600 text-white border-transparent"
                  onClick={handleDelete}
                >
                  Yes, Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
