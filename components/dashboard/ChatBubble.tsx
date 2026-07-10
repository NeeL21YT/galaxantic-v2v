/**
 * components/dashboard/ChatBubble.tsx
 *
 * A single message bubble for the AI Coach chat interface.
 */

import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/dashboard";
import type React from "react";
import { User } from "lucide-react";

interface ChatBubbleProps {
  message: ChatMessage;
}

function safeHref(href: string): string {
  if (/^(https?:|mailto:)/i.test(href)) return href;
  return "#";
}

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);

  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;

    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={key}
          href={safeHref(linkMatch[2])}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2"
        >
          {linkMatch[1]}
        </a>
      );
    }

    return <span key={key}>{part}</span>;
  });
}

function isTableSeparator(line: string): boolean {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function parseTableRows(lines: string[]) {
  return lines.map((line) =>
    line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim())
  );
}

function renderContent(text: string): React.ReactNode {
  const blocks = text.split(/```/g);

  return blocks.map((block, blockIndex) => {
    if (blockIndex % 2 === 1) {
      const code = block.replace(/^\w+\n/, "");
      return (
        <pre
          key={`code-${blockIndex}`}
          className="my-3 overflow-x-auto rounded-lg px-3 py-2 text-xs"
          style={{ background: "rgba(0,0,0,0.06)" }}
        >
          <code>{code}</code>
        </pre>
      );
    }

    const lines = block.split("\n");
    const nodes: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i].trim();

      if (!line) {
        i += 1;
        continue;
      }

      const heading = line.match(/^(#{1,6})\s+(.+)$/);
      if (heading) {
        const level = heading[1].length;
        const className = level === 1 ? "text-base" : "text-sm";
        nodes.push(
          <p key={`h-${blockIndex}-${i}`} className={cn("mt-3 first:mt-0 font-semibold", className)}>
            {renderInline(heading[2], `h-${blockIndex}-${i}`)}
          </p>
        );
        i += 1;
        continue;
      }

      if (i + 1 < lines.length && line.includes("|") && isTableSeparator(lines[i + 1])) {
        const tableLines = [lines[i]];
        i += 2;
        while (i < lines.length && lines[i].includes("|") && lines[i].trim()) {
          tableLines.push(lines[i]);
          i += 1;
        }
        const [header, ...body] = parseTableRows(tableLines);
        nodes.push(
          <div key={`table-${blockIndex}-${i}`} className="my-3 max-w-full overflow-x-auto">
            <table className="w-full min-w-64 border-collapse text-left text-xs">
              <thead>
                <tr>
                  {header.map((cell, cellIndex) => (
                    <th key={cellIndex} className="border px-2 py-1 font-semibold" style={{ borderColor: "var(--color-border)" }}>
                      {renderInline(cell, `th-${blockIndex}-${cellIndex}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border px-2 py-1 align-top" style={{ borderColor: "var(--color-border)" }}>
                        {renderInline(cell, `td-${blockIndex}-${rowIndex}-${cellIndex}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }

      if (/^[-*]\s+/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
          items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
          i += 1;
        }
        nodes.push(
          <ul key={`ul-${blockIndex}-${i}`} className="my-2 list-disc space-y-1 pl-5">
            {items.map((item, itemIndex) => (
              <li key={itemIndex}>{renderInline(item, `ul-${blockIndex}-${i}-${itemIndex}`)}</li>
            ))}
          </ul>
        );
        continue;
      }

      if (/^\d+\.\s+/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
          items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
          i += 1;
        }
        nodes.push(
          <ol key={`ol-${blockIndex}-${i}`} className="my-2 list-decimal space-y-1 pl-5">
            {items.map((item, itemIndex) => (
              <li key={itemIndex}>{renderInline(item, `ol-${blockIndex}-${i}-${itemIndex}`)}</li>
            ))}
          </ol>
        );
        continue;
      }

      nodes.push(
        <p key={`p-${blockIndex}-${i}`} className="my-2 first:mt-0 last:mb-0">
          {renderInline(line, `p-${blockIndex}-${i}`)}
        </p>
      );
      i += 1;
    }

    return <div key={`block-${blockIndex}`}>{nodes}</div>;
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
        {isAI ? "AI" : <User className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isAI 
            ? "rounded-tl-none" 
            : "rounded-tr-none [&_*]:!text-white"
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
