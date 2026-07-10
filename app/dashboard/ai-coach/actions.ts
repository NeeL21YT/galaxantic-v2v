"use server";

/**
 * app/dashboard/ai-coach/actions.ts
 *
 * Authenticated Server Actions for Stage 2E AI Career Coach integration.
 */

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/supabase/server";
import { loadCoachContext } from "@/lib/coach/context-loader";
import { buildCoachPrompt } from "@/lib/coach/prompt-builder";
import {
  CoachGeminiError,
  getFriendlyCoachErrorMessage,
  sendCoachPromptToGemini,
} from "@/lib/coach/gemini-chat";
import { generateConversationTitle } from "@/lib/coach/conversation-title";
import {
  appendMessage,
  createConversation,
  deleteConversation,
  loadConversation,
  loadConversations,
  loadRecentMessages,
  renameConversation,
  roleToSender,
} from "@/lib/coach/history";
import type { ChatConversation, ChatMessageRow } from "@/types/database";
import type { ChatMessage } from "@/types/dashboard";

export interface CoachConversationSummary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoachLoadedConversation {
  conversation: CoachConversationSummary;
  messages: ChatMessage[];
}

export interface SendCoachMessageInput {
  conversationId?: string | null;
  message: string;
}

export interface SendCoachMessageSuccess {
  success: true;
  conversation: CoachConversationSummary;
  messages: ChatMessage[];
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
  followUpSuggestions: string[];
  intent: string;
}

export interface CoachActionError {
  success: false;
  error: string;
  code: string;
  conversation?: CoachConversationSummary;
  userMessage?: ChatMessage;
}

function toConversationSummary(conversation: ChatConversation): CoachConversationSummary {
  return {
    id: conversation.id,
    title: conversation.title,
    createdAt: conversation.created_at,
    updatedAt: conversation.updated_at,
  };
}

function toDashboardMessage(row: ChatMessageRow): ChatMessage {
  return {
    id: row.id,
    sender: roleToSender(row.role),
    content: row.message,
    timestamp: row.created_at,
  };
}

async function requireUserId(): Promise<string> {
  const user = await getUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user.id;
}

function friendlyActionError(err: unknown): CoachActionError {
  if (err instanceof CoachGeminiError) {
    return {
      success: false,
      error: getFriendlyCoachErrorMessage(err.code),
      code: err.code,
    };
  }

  const msg = err instanceof Error ? err.message : String(err);
  if (msg === "UNAUTHENTICATED") {
    return {
      success: false,
      error: "Please sign in to use the AI Career Coach.",
      code: "UNAUTHENTICATED",
    };
  }

  console.error("[ai-coach/actions]", msg);
  return {
    success: false,
    error: "Something went wrong. Please try again.",
    code: "ACTION_FAILED",
  };
}

export async function createConversationAction(
  firstMessage?: string
): Promise<{ success: true; conversation: CoachConversationSummary } | CoachActionError> {
  try {
    const userId = await requireUserId();
    const title = firstMessage ? generateConversationTitle(firstMessage) : "New Conversation";
    const conversation = await createConversation(userId, title);
    if (!conversation) {
      return { success: false, error: "Could not create a conversation.", code: "DATABASE_FAILED" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/ai-coach");
    return { success: true, conversation: toConversationSummary(conversation) };
  } catch (err) {
    return friendlyActionError(err);
  }
}

export async function loadConversationsAction(): Promise<CoachConversationSummary[]> {
  try {
    const userId = await requireUserId();
    const conversations = await loadConversations(userId);
    return conversations.map(toConversationSummary);
  } catch {
    return [];
  }
}

export async function loadConversationAction(
  conversationId: string
): Promise<{ success: true; data: CoachLoadedConversation } | CoachActionError> {
  try {
    const userId = await requireUserId();
    const loaded = await loadConversation(userId, conversationId);
    if (!loaded) {
      return { success: false, error: "Conversation not found.", code: "NOT_FOUND" };
    }

    return {
      success: true,
      data: {
        conversation: toConversationSummary(loaded.conversation),
        messages: loaded.messages.map(toDashboardMessage),
      },
    };
  } catch (err) {
    return friendlyActionError(err);
  }
}

export async function deleteConversationAction(
  conversationId: string
): Promise<{ success: true } | CoachActionError> {
  try {
    const userId = await requireUserId();
    const ok = await deleteConversation(userId, conversationId);
    if (!ok) return { success: false, error: "Could not delete the conversation.", code: "DATABASE_FAILED" };

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/ai-coach");
    return { success: true };
  } catch (err) {
    return friendlyActionError(err);
  }
}

export async function renameConversationAction(
  conversationId: string,
  title: string
): Promise<{ success: true; conversation: CoachConversationSummary } | CoachActionError> {
  try {
    const userId = await requireUserId();
    const updated = await renameConversation(userId, conversationId, title);
    if (!updated) return { success: false, error: "Could not rename the conversation.", code: "DATABASE_FAILED" };

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/ai-coach");
    return { success: true, conversation: toConversationSummary(updated) };
  } catch (err) {
    return friendlyActionError(err);
  }
}

export async function sendMessageAction(
  input: SendCoachMessageInput
): Promise<SendCoachMessageSuccess | CoachActionError> {
  let conversationSummary: CoachConversationSummary | undefined;
  let persistedUserMessage: ChatMessage | undefined;

  try {
    const userId = await requireUserId();
    const content = input.message.replace(/\s+/g, " ").trim();

    if (!content) {
      return { success: false, error: "Please enter a message.", code: "EMPTY_MESSAGE" };
    }
    if (content.length > 4000) {
      return { success: false, error: "Please keep your message under 4,000 characters.", code: "MESSAGE_TOO_LONG" };
    }

    let conversation = input.conversationId
      ? (await loadConversation(userId, input.conversationId))?.conversation ?? null
      : null;

    if (!conversation) {
      conversation = await createConversation(userId, generateConversationTitle(content));
    }
    if (!conversation) {
      return { success: false, error: "Could not start the conversation.", code: "DATABASE_FAILED" };
    }

    conversationSummary = toConversationSummary(conversation);

    const userMessage = await appendMessage({
      conversation_id: conversation.id,
      user_id: userId,
      role: "user",
      message: content,
    });
    if (!userMessage) {
      return { success: false, error: "Could not save your message.", code: "DATABASE_FAILED" };
    }

    persistedUserMessage = toDashboardMessage(userMessage);

    const [context, recentMessages] = await Promise.all([
      loadCoachContext(userId),
      loadRecentMessages(userId, conversation.id),
    ]);

    const previousMessages = recentMessages.filter((msg) => msg.id !== userMessage.id);
    const prompt = buildCoachPrompt({
      context,
      previousMessages,
      latestUserMessage: content,
    });
    const aiResponse = await sendCoachPromptToGemini(prompt);

    const assistantMessage = await appendMessage({
      conversation_id: conversation.id,
      user_id: userId,
      role: "assistant",
      message: aiResponse.responseMarkdown,
    });
    if (!assistantMessage) {
      return {
        success: false,
        error: "The AI responded, but the message could not be saved.",
        code: "DATABASE_FAILED",
        conversation: conversationSummary,
        userMessage: persistedUserMessage,
      };
    }

    const refreshedLoad = await loadConversation(userId, conversation.id);
    const refreshed = refreshedLoad?.conversation ?? conversation;
    const allMessages = refreshedLoad?.messages.map(toDashboardMessage) ?? [];

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/ai-coach");

    return {
      success: true,
      conversation: toConversationSummary(refreshed),
      messages: allMessages,
      userMessage: persistedUserMessage,
      assistantMessage: toDashboardMessage(assistantMessage),
      followUpSuggestions: aiResponse.followUpSuggestions,
      intent: aiResponse.intent,
    };
  } catch (err) {
    const error = friendlyActionError(err);
    return {
      ...error,
      conversation: conversationSummary,
      userMessage: persistedUserMessage,
    };
  }
}
