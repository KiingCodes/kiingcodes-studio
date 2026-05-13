
-- Wipe all existing blog posts (admin will create new premium posts)
DELETE FROM public.blog_posts;

-- Add workflow status column for draft / scheduled / published flow
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS workflow_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (workflow_status IN ('draft','review','scheduled','published','archived')),
  ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMPTZ;

-- Create public storage bucket for blog media (covers + inline images)
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-media', 'blog-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS for blog-media: public read, admin write
CREATE POLICY "blog-media public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-media');

CREATE POLICY "blog-media admin insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "blog-media admin update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'blog-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "blog-media admin delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'blog-media' AND public.has_role(auth.uid(), 'admin'));
