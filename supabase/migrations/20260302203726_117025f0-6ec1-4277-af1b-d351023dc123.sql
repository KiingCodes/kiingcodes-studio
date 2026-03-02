
-- Create conversation messages table for Owami memory
CREATE TABLE public.chat_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Index for fast conversation lookups
CREATE INDEX idx_chat_messages_conversation ON public.chat_messages(conversation_id, created_at);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can insert messages (visitor or admin)
CREATE POLICY "Anyone can insert messages" ON public.chat_messages FOR INSERT WITH CHECK (true);

-- Anyone can read messages by conversation_id (they need the ID)
CREATE POLICY "Anyone can read own conversation" ON public.chat_messages FOR SELECT USING (true);

-- Admins can read all
CREATE POLICY "Admins can manage messages" ON public.chat_messages FOR ALL USING (public.has_role(auth.uid(), 'admin'));
