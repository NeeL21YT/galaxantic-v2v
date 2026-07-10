-- =============================================================
-- Herizon — Stage 2E: AI Career Coach Chat
-- Migration: 20260710000004_ai_coach_chat
--
-- Replaces the previous simple chat_history concept with:
--   • chat_conversations — one row per user conversation
--   • chat_messages      — many messages per conversation
--
-- All tables are protected by RLS. Users can only access their
-- own conversations and messages.
-- =============================================================

-- ── 1. Conversations ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.profiles(auth_user_id) ON DELETE CASCADE,
  title       TEXT        NOT NULL DEFAULT 'New Conversation',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_updated
  ON public.chat_conversations(user_id, updated_at DESC);

CREATE TRIGGER chat_conversations_updated_at
  BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chat_conversations_select_own"
  ON public.chat_conversations FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "chat_conversations_insert_own"
  ON public.chat_conversations FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "chat_conversations_update_own"
  ON public.chat_conversations FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "chat_conversations_delete_own"
  ON public.chat_conversations FOR DELETE
  USING (user_id = auth.uid());

-- ── 2. Messages ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID        NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  user_id         UUID        NOT NULL REFERENCES public.profiles(auth_user_id) ON DELETE CASCADE,
  role            TEXT        NOT NULL CHECK (role IN ('user', 'assistant')),
  message         TEXT        NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_created
  ON public.chat_messages(conversation_id, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_chat_messages_user_created
  ON public.chat_messages(user_id, created_at DESC);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chat_messages_select_own"
  ON public.chat_messages FOR SELECT
  USING (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.chat_conversations c
      WHERE c.id = chat_messages.conversation_id
        AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "chat_messages_insert_own"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.chat_conversations c
      WHERE c.id = chat_messages.conversation_id
        AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "chat_messages_delete_own"
  ON public.chat_messages FOR DELETE
  USING (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.chat_conversations c
      WHERE c.id = chat_messages.conversation_id
        AND c.user_id = auth.uid()
    )
  );

-- =============================================================
-- END OF MIGRATION
-- =============================================================
