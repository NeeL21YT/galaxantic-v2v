/**
 * lib/coach/history.ts
 *
 * Conversation CRUD for the AI Career Coach. All reads and writes go through
 * Supabase RLS and are additionally scoped by the authenticated user id.
 */

import { createClient } from "@/lib/supabase/server";
import type {
  ChatConversation,
  ChatMessageInsert,
  ChatMessageRole,
  ChatMessageRow,
} from "@/types/database";

export interface ConversationWithMessages {
  conversation: ChatConversation;
  messages: ChatMessageRow[];
}

export interface CoachActivity {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  intent: "learning_plan" | "interview_advice" | "conversation_started" | "ai_coach_session";
}

function cleanTitle(title: string): string {
  const normalized = title.replace(/\s+/g, " ").trim();
  if (!normalized) return "Career Advice";
  return normalized.slice(0, 60);
}

export async function createConversation(userId: string, title: string): Promise<ChatConversation | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chat_conversations")
    .insert({
      user_id: userId,
      title: cleanTitle(title),
    })
    .select("*")
    .single();

  if (error) {
    console.error("[coach/history] createConversation:", error.message);
    return null;
  }

  return data as ChatConversation;
}

export async function loadConversations(userId: string): Promise<ChatConversation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chat_conversations")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(30);

  if (error) {
    console.error("[coach/history] loadConversations:", error.message);
    return [];
  }

  return (data ?? []) as ChatConversation[];
}

export async function loadConversation(
  userId: string,
  conversationId: string
): Promise<ConversationWithMessages | null> {
  const supabase = await createClient();

  const { data: conversation, error: conversationError } = await supabase
    .from("chat_conversations")
    .select("*")
    .eq("id", conversationId)
    .eq("user_id", userId)
    .maybeSingle();

  if (conversationError) {
    console.error("[coach/history] loadConversation:", conversationError.message);
    return null;
  }
  if (!conversation) return null;

  const { data: messages, error: messagesError } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (messagesError) {
    console.error("[coach/history] loadConversation messages:", messagesError.message);
    return null;
  }

  return {
    conversation: conversation as ChatConversation,
    messages: (messages ?? []) as ChatMessageRow[],
  };
}

export async function loadRecentMessages(
  userId: string,
  conversationId: string,
  limit = 24
): Promise<ChatMessageRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[coach/history] loadRecentMessages:", error.message);
    return [];
  }

  return ((data ?? []) as ChatMessageRow[]).reverse();
}

export async function appendMessage(
  input: ChatMessageInsert
): Promise<ChatMessageRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chat_messages")
    .insert(input)
    .select("*")
    .single();

  if (error) {
    console.error("[coach/history] appendMessage:", error.message);
    return null;
  }

  await supabase
    .from("chat_conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", input.conversation_id)
    .eq("user_id", input.user_id);

  return data as ChatMessageRow;
}

export async function deleteConversation(userId: string, conversationId: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("chat_conversations")
    .delete()
    .eq("id", conversationId)
    .eq("user_id", userId);

  if (error) {
    console.error("[coach/history] deleteConversation:", error.message);
    return false;
  }

  return true;
}

export async function renameConversation(
  userId: string,
  conversationId: string,
  title: string
): Promise<ChatConversation | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chat_conversations")
    .update({ title: cleanTitle(title) })
    .eq("id", conversationId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    console.error("[coach/history] renameConversation:", error.message);
    return null;
  }

  return data as ChatConversation;
}

function inferActivityIntent(title: string): CoachActivity["intent"] {
  if (/\b(learn|skill|course|certification|roadmap)\b/i.test(title)) return "learning_plan";
  if (/\b(interview|prep|google)\b/i.test(title)) return "interview_advice";
  if (/\b(new|career advice)\b/i.test(title)) return "conversation_started";
  return "ai_coach_session";
}

export async function loadCoachActivities(userId: string, limit = 3): Promise<CoachActivity[]> {
  const conversations = await loadConversations(userId);

  return conversations.slice(0, limit).map((conversation) => {
    const intent = inferActivityIntent(conversation.title);
    const labelByIntent: Record<CoachActivity["intent"], string> = {
      learning_plan: "Learning Plan Generated",
      interview_advice: "Interview Advice Requested",
      conversation_started: "Conversation Started",
      ai_coach_session: "AI Coach Session",
    };

    return {
      id: conversation.id,
      title: labelByIntent[intent],
      description: conversation.title,
      createdAt: conversation.updated_at,
      intent,
    };
  });
}

export function roleToSender(role: ChatMessageRole): "user" | "ai" {
  return role === "assistant" ? "ai" : "user";
}
