import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Upload, Trash2, RefreshCw, Copy, Eye } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface MediaFile {
  name: string;
  id?: string;
  created_at?: string;
  updated_at?: string;
  metadata?: { size?: number; mimetype?: string };
  publicUrl: string;
}

const BUCKET = "blog-media";

export default function AdminMedia() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [replacing, setReplacing] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<MediaFile | null>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    const mapped: MediaFile[] = (data || [])
      .filter((f) => f.name && !f.name.endsWith("/"))
      .map((f) => ({
        ...f,
        publicUrl: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
      }));
    setFiles(mapped);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    setUploading(false);
    if (error) return toast.error(error.message);
    toast.success("Uploaded");
    load();
  };

  const handleReplace = async (originalName: string, file: File) => {
    setReplacing(originalName);
    // Upsert into same path to preserve URL references
    const { error } = await supabase.storage.from(BUCKET).upload(originalName, file, {
      cacheControl: "3600",
      upsert: true,
    });
    setReplacing(null);
    if (error) return toast.error(error.message);
    toast.success("Replaced — existing URLs now serve the new file");
    load();
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete ${name}? Any blog posts referencing this URL will break.`)) return;
    const { error } = await supabase.storage.from(BUCKET).remove([name]);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    setFiles((f) => f.filter((x) => x.name !== name));
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied");
  };

  const visible = files.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Blog Media</h1>
          <p className="text-muted-foreground">
            Preview, replace and remove images used in blog covers and inline content.
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search filenames…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-56"
          />
          <Button variant="outline" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => uploadRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
            Upload
          </Button>
          <input
            ref={uploadRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
              e.target.value = "";
            }}
          />
          <input
            ref={replaceRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f && replacing) handleReplace(replacing, f);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Library ({visible.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : visible.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No media files yet</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {visible.map((file) => (
                <div
                  key={file.name}
                  className="group relative rounded-xl border border-border overflow-hidden bg-card"
                >
                  <button
                    type="button"
                    onClick={() => setPreview(file)}
                    className="block w-full aspect-square overflow-hidden bg-muted"
                  >
                    <img
                      src={file.publicUrl}
                      alt={file.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </button>
                  <div className="p-2 space-y-1">
                    <p className="text-xs font-medium truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {file.metadata?.size
                        ? `${(file.metadata.size / 1024).toFixed(1)} KB`
                        : ""}
                      {file.created_at
                        ? ` · ${format(new Date(file.created_at), "MMM d, yyyy")}`
                        : ""}
                    </p>
                    <div className="flex gap-1 pt-1">
                      <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setPreview(file)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => copyUrl(file.publicUrl)}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2"
                        disabled={replacing === file.name}
                        onClick={() => {
                          setReplacing(file.name);
                          replaceRef.current?.click();
                        }}
                      >
                        {replacing === file.name ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Upload className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 ml-auto"
                        onClick={() => handleDelete(file.name)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="truncate">{preview?.name}</DialogTitle>
          </DialogHeader>
          {preview && (
            <div className="space-y-3">
              <img
                src={preview.publicUrl}
                alt={preview.name}
                className="w-full max-h-[60vh] object-contain rounded-lg border border-border bg-muted"
              />
              <div className="flex gap-2 items-center">
                <Input value={preview.publicUrl} readOnly className="font-mono text-xs" />
                <Button variant="outline" onClick={() => copyUrl(preview.publicUrl)}>
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}