/**
 * components/dashboard/ChatBubble.tsx
 *
 * A single message bubble for the AI Coach chat interface.
 */

import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/dashboard";

interface ChatBubbleProps {
  message: ChatMessage;
}

/** Simple markdown-lite: converts **bold** to <strong> and newlines to <br /> */
function renderContent(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.flatMap((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return [<strong key={i}>{part.slice(2, -2)}</strong>];
    }
    return part.split("\n").flatMap((line, j, arr) =>
      j < arr.length - 1 ? [line, <br key={`${i}-${j}`} />] : [line]
    );
  });
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isAI = message.sender === "ai";

  return (
    <div
      className={cn("flex gap-3", isAI ? "flex-row" : "flex-row-reverse")}
      role="listitem"
      aria-label={`${isAI ? "AI Coach" : "You"}: ${message.content}`}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 self-start mt-0.5"
        style={{
          background: isAI ? "var(--color-rose-gold)" : "var(--color-rackley)",
          color: "#fff",
        }}
        aria-hidden="true"
      >
        {isAI ? "AI" : "P"}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isAI ? "rounded-tl-none" : "rounded-tr-none"
        )}
        style={{
          background: isAI ? "var(--color-surface)" : "var(--color-rose-gold)",
          color: isAI ? "var(--color-text-primary)" : "#fff",
          border: isAI ? "1px solid var(--color-border)" : "none",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {renderContent(message.content)}
        <p
          className="text-[10px] mt-2 opacity-60 text-right"
          aria-label={`Sent at ${new Date(message.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`}
        >
          {new Date(message.timestamp).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
