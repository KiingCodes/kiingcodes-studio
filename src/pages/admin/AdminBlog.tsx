import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PremiumBlogPost } from "@/components/PremiumBlogPost";
import { BACKGROUND_PRESETS, ANIMATION_PRESETS } from "@/lib/background-presets";
import { format } from "date-fns";
import { Loader2, Plus, Pencil, Trash2, Sparkles, Upload, Image as ImageIcon, Calendar } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const LAYOUTS = [
  { key: "classic", label: "Classic" },
  { key: "magazine", label: "Magazine" },
  { key: "editorial", label: "Editorial" },
  { key: "minimal", label: "Minimal" },
];

const ACCENT_COLORS = [
  { value: "var(--primary)", label: "Brand Primary", swatch: "hsl(var(--primary))" },
  { value: "var(--accent)", label: "Brand Accent", swatch: "hsl(var(--accent))" },
  { value: "20 90% 55%", label: "Sunset Orange", swatch: "hsl(20 90% 55%)" },
  { value: "195 85% 50%", label: "Ocean Blue", swatch: "hsl(195 85% 50%)" },
  { value: "160 70% 45%", label: "Mint", swatch: "hsl(160 70% 45%)" },
  { value: "265 70% 55%", label: "Royal Purple", swatch: "hsl(265 70% 55%)" },
  { value: "340 80% 55%", label: "Pink", swatch: "hsl(340 80% 55%)" },
];

const WORKFLOW_STATUSES = [
  { key: "draft", label: "Draft", color: "bg-muted text-muted-foreground" },
  { key: "review", label: "In Review", color: "bg-amber-500/15 text-amber-600" },
  { key: "scheduled", label: "Scheduled", color: "bg-blue-500/15 text-blue-600" },
  { key: "published", label: "Published", color: "bg-emerald-500/15 text-emerald-600" },
  { key: "archived", label: "Archived", color: "bg-zinc-500/15 text-zinc-500" },
];

const initialForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image_url: "",
  tags: "",
  is_published: false,
  cover_gradient: "",
  accent_color: "var(--primary)",
  animation_preset: "fade-in",
  layout_style: "classic",
  reading_time_minutes: 5 as number | null,
  workflow_status: "draft",
  scheduled_for: "",
};

export default function AdminBlog() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [formData, setFormData] = useState(initialForm);
  const [uploading, setUploading] = useState<"cover" | "inline" | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const inlineInputRef = useRef<HTMLInputElement>(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const buildPayload = (data: typeof formData) => ({
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    cover_image_url: data.cover_image_url || null,
    tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    is_published: data.workflow_status === "published",
    published_at:
      data.workflow_status === "published"
        ? new Date().toISOString()
        : data.workflow_status === "scheduled" && data.scheduled_for
          ? new Date(data.scheduled_for).toISOString()
          : null,
    cover_gradient: data.cover_gradient || null,
    accent_color: data.accent_color || null,
    animation_preset: data.animation_preset || null,
    layout_style: data.layout_style || null,
    reading_time_minutes: data.reading_time_minutes,
    workflow_status: data.workflow_status,
    scheduled_for: data.scheduled_for ? new Date(data.scheduled_for).toISOString() : null,
  });

  const createPost = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("blog_posts").insert([buildPayload(data) as any]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success("Blog post created");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error("Failed to create blog post"),
  });

  const updatePost = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from("blog_posts")
        .update(buildPayload(data) as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success("Blog post updated");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error("Failed to update blog post"),
  });

  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success("Blog post deleted");
    },
    onError: () => toast.error("Failed to delete blog post"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) updatePost.mutate({ id: editingPost.id, data: formData });
    else createPost.mutate(formData);
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingPost(null);
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      cover_image_url: post.cover_image_url || "",
      tags: post.tags?.join(", ") || "",
      is_published: post.is_published,
      cover_gradient: post.cover_gradient || "",
      accent_color: post.accent_color || "var(--primary)",
      animation_preset: post.animation_preset || "fade-in",
      layout_style: post.layout_style || "classic",
      reading_time_minutes: post.reading_time_minutes ?? 5,
      workflow_status: post.workflow_status || (post.is_published ? "published" : "draft"),
      scheduled_for: post.scheduled_for ? new Date(post.scheduled_for).toISOString().slice(0, 16) : "",
    });
    setIsDialogOpen(true);
  };

  const uploadImage = async (file: File, mode: "cover" | "inline") => {
    setUploading(mode);
    try {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("blog-media").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("blog-media").getPublicUrl(path);
      const url = data.publicUrl;
      if (mode === "cover") {
        setFormData((f) => ({ ...f, cover_image_url: url }));
        toast.success("Cover image uploaded");
      } else {
        const md = `\n\n![${file.name}](${url})\n\n`;
        setFormData((f) => ({ ...f, content: f.content + md }));
        toast.success("Image inserted into content");
      }
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">Premium magazine-style editor with live preview</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" /> New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                {editingPost ? "Edit" : "Create"} Blog Post
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                    </div>
                    <div>
                      <Label htmlFor="slug">Slug</Label>
                      <Input id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea id="excerpt" value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="content">Content (Markdown)</Label>
                    <div className="flex items-center gap-2 mb-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => inlineInputRef.current?.click()}
                        disabled={uploading === "inline"}
                      >
                        {uploading === "inline" ? (
                          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        ) : (
                          <ImageIcon className="h-3.5 w-3.5 mr-1.5" />
                        )}
                        Insert image
                      </Button>
                      <input
                        ref={inlineInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) uploadImage(f, "inline");
                          e.target.value = "";
                        }}
                      />
                    </div>
                    <Textarea id="content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="min-h-[260px] font-mono" required />
                  </div>
                  <div>
                    <Label htmlFor="cover_image_url">Cover Image URL</Label>
                    <div className="flex gap-2">
                      <Input id="cover_image_url" value={formData.cover_image_url} onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })} placeholder="https://… or upload" />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => coverInputRef.current?.click()}
                        disabled={uploading === "cover"}
                      >
                        {uploading === "cover" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      </Button>
                      <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) uploadImage(f, "cover");
                          e.target.value = "";
                        }}
                      />
                    </div>
                    {formData.cover_image_url && (
                      <img src={formData.cover_image_url} alt="cover preview" className="mt-2 h-24 rounded-lg border border-border object-cover" />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input id="tags" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="react, web development, tutorial" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="reading_time">Reading time (min)</Label>
                      <Input id="reading_time" type="number" min={1} value={formData.reading_time_minutes ?? ""} onChange={(e) => setFormData({ ...formData, reading_time_minutes: e.target.value ? parseInt(e.target.value) : null })} />
                    </div>
                    <div>
                      <Label htmlFor="workflow_status">Workflow status</Label>
                      <Select value={formData.workflow_status} onValueChange={(v) => setFormData({ ...formData, workflow_status: v })}>
                        <SelectTrigger id="workflow_status"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {WORKFLOW_STATUSES.map((s) => (
                            <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.workflow_status === "scheduled" && (
                      <div>
                        <Label htmlFor="scheduled_for" className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Publish at
                        </Label>
                        <Input
                          id="scheduled_for"
                          type="datetime-local"
                          value={formData.scheduled_for}
                          onChange={(e) => setFormData({ ...formData, scheduled_for: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="style" className="space-y-5 mt-4">
                  <div>
                    <Label className="mb-2 block">Layout style</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {LAYOUTS.map((l) => (
                        <button
                          type="button"
                          key={l.key}
                          onClick={() => setFormData({ ...formData, layout_style: l.key })}
                          className={`px-3 py-3 rounded-lg border text-sm font-medium transition ${
                            formData.layout_style === l.key
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:bg-muted/50"
                          }`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Cover gradient / wallpaper</Label>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {BACKGROUND_PRESETS.map((p) => (
                        <button
                          type="button"
                          key={p.key}
                          onClick={() => setFormData({ ...formData, cover_gradient: p.key === "none" ? "" : p.key })}
                          className={`relative h-16 rounded-lg border-2 overflow-hidden transition ${
                            (formData.cover_gradient || "none") === p.key
                              ? "border-primary ring-2 ring-primary/30"
                              : "border-border hover:border-primary/50"
                          }`}
                          style={{ background: p.gradient || "hsl(var(--muted))" }}
                        >
                          <span className="absolute bottom-1 left-1 right-1 text-[10px] font-medium text-foreground bg-background/70 backdrop-blur rounded px-1 py-0.5">
                            {p.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Accent color</Label>
                    <div className="flex flex-wrap gap-2">
                      {ACCENT_COLORS.map((c) => (
                        <button
                          type="button"
                          key={c.value}
                          onClick={() => setFormData({ ...formData, accent_color: c.value })}
                          title={c.label}
                          className={`w-10 h-10 rounded-full border-2 transition ${
                            formData.accent_color === c.value
                              ? "border-foreground scale-110"
                              : "border-border hover:scale-105"
                          }`}
                          style={{ background: c.swatch }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Animation preset</Label>
                    <Select value={formData.animation_preset} onValueChange={(v) => setFormData({ ...formData, animation_preset: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ANIMATION_PRESETS.map((a) => (
                          <SelectItem key={a.key} value={a.key}>{a.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="mt-4">
                  <div className="rounded-xl border border-border bg-background p-6 max-h-[60vh] overflow-y-auto">
                    <PremiumBlogPost
                      post={{
                        title: formData.title || "Untitled post",
                        excerpt: formData.excerpt || null,
                        content: formData.content || "_Start writing in the Content tab…_",
                        cover_image_url: formData.cover_image_url || null,
                        cover_gradient: formData.cover_gradient || null,
                        accent_color: formData.accent_color || null,
                        animation_preset: formData.animation_preset || null,
                        layout_style: formData.layout_style || null,
                        reading_time_minutes: formData.reading_time_minutes ?? null,
                        published_at: new Date().toISOString(),
                        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
                      }}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingPost ? "Update" : "Create"} Post</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle>All Posts</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : posts?.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No blog posts yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Layout</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts?.map((post: any) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell className="text-muted-foreground">{post.slug}</TableCell>
                    <TableCell><Badge variant="outline">{post.layout_style || "classic"}</Badge></TableCell>
                    <TableCell>
                      {(() => {
                        const ws = WORKFLOW_STATUSES.find((s) => s.key === (post.workflow_status || (post.is_published ? "published" : "draft")));
                        return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ws?.color || ""}`}>{ws?.label || "Draft"}</span>;
                      })()}
                    </TableCell>
                    <TableCell>{format(new Date(post.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => { if (confirm("Delete this post?")) deletePost.mutate(post.id); }}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
