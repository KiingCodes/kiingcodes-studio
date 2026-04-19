
-- 1) page_sections: dynamic, editable page content
CREATE TABLE public.page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text NOT NULL,
  section_key text NOT NULL,
  section_type text NOT NULL DEFAULT 'text',
  order_index integer NOT NULL DEFAULT 0,
  headline text,
  subheadline text,
  body text,
  cta_label text,
  cta_url text,
  background_image_url text,
  background_gradient text,
  accent_color text,
  animation_preset text DEFAULT 'fade-in',
  extra jsonb DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(page_slug, section_key)
);

CREATE INDEX idx_page_sections_page ON public.page_sections(page_slug, order_index) WHERE is_active = true;

ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active page sections"
  ON public.page_sections FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage page sections"
  ON public.page_sections FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_page_sections_updated_at
  BEFORE UPDATE ON public.page_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) media_uploads: registry of admin-uploaded media
CREATE TABLE public.media_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_by uuid,
  file_path text NOT NULL,
  public_url text NOT NULL,
  file_type text NOT NULL,
  mime_type text,
  file_size_bytes bigint,
  alt_text text,
  caption text,
  used_in text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.media_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view media library"
  ON public.media_uploads FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage media"
  ON public.media_uploads FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- 3) Extend blog_posts with premium styling
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS cover_gradient text,
  ADD COLUMN IF NOT EXISTS accent_color text,
  ADD COLUMN IF NOT EXISTS animation_preset text DEFAULT 'fade-in',
  ADD COLUMN IF NOT EXISTS layout_style text DEFAULT 'classic',
  ADD COLUMN IF NOT EXISTS reading_time_minutes integer;

-- 4) client-media storage bucket (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-media', 'client-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read client-media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'client-media');

CREATE POLICY "Admins can upload client-media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'client-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update client-media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'client-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete client-media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'client-media' AND public.has_role(auth.uid(), 'admin'));
