import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PageSection {
  id: string;
  page_slug: string;
  section_key: string;
  section_type: string;
  order_index: number;
  headline: string | null;
  subheadline: string | null;
  body: string | null;
  cta_label: string | null;
  cta_url: string | null;
  background_image_url: string | null;
  background_gradient: string | null;
  accent_color: string | null;
  animation_preset: string | null;
  extra: Record<string, unknown> | null;
  is_active: boolean;
}

export function usePageSections(pageSlug: string) {
  return useQuery({
    queryKey: ["page_sections", pageSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page_slug", pageSlug)
        .eq("is_active", true)
        .order("order_index");
      if (error) throw error;
      return (data ?? []) as unknown as PageSection[];
    },
  });
}

export function usePageSection(pageSlug: string, sectionKey: string) {
  return useQuery({
    queryKey: ["page_section", pageSlug, sectionKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page_slug", pageSlug)
        .eq("section_key", sectionKey)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as unknown as PageSection | null;
    },
  });
}