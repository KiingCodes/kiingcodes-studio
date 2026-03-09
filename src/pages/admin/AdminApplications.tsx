import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, User, Mail, Phone, MapPin, GraduationCap, Clock, ExternalLink } from "lucide-react";
import { format } from "date-fns";

const STATUS_OPTIONS = ["new", "reviewed", "shortlisted", "rejected"] as const;
type AppStatus = typeof STATUS_OPTIONS[number];

const statusStyles: Record<AppStatus, string> = {
  new: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  reviewed: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  shortlisted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function AdminApplications() {
  const [filter, setFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: applications, isLoading } = useQuery({
    queryKey: ["admin-applications", filter],
    queryFn: async () => {
      let query = supabase
        .from("job_applications")
        .select("*, job_listings(title)")
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("job_applications")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      toast({ title: "Status updated" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const downloadCv = async (cvUrl: string, name: string) => {
    const { data, error } = await supabase.storage.from("cv-uploads").createSignedUrl(cvUrl, 300);
    if (error || !data?.signedUrl) {
      toast({ title: "Download failed", description: "Could not generate download link.", variant: "destructive" });
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  const counts = {
    all: applications?.length ?? 0,
    new: applications?.filter((a) => a.status === "new").length ?? 0,
    reviewed: applications?.filter((a) => a.status === "reviewed").length ?? 0,
    shortlisted: applications?.filter((a) => a.status === "shortlisted").length ?? 0,
    rejected: applications?.filter((a) => a.status === "rejected").length ?? 0,
  };

  // Use unfiltered counts for filter badges
  const { data: allApps } = useQuery({
    queryKey: ["admin-applications-counts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("job_applications").select("status");
      if (error) throw error;
      return data;
    },
  });

  const totalCounts = {
    all: allApps?.length ?? 0,
    new: allApps?.filter((a) => a.status === "new").length ?? 0,
    reviewed: allApps?.filter((a) => a.status === "reviewed").length ?? 0,
    shortlisted: allApps?.filter((a) => a.status === "shortlisted").length ?? 0,
    rejected: allApps?.filter((a) => a.status === "rejected").length ?? 0,
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Job Applications</h1>
        <p className="text-muted-foreground">Review and manage candidate applications</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", ...STATUS_OPTIONS] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
            className="capitalize"
          >
            {status} ({totalCounts[status] ?? 0})
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      ) : !applications || applications.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No applications found{filter !== "all" ? ` with status "${filter}"` : ""}.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <Card key={app.id} className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      {app.full_name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Applied for: <span className="font-medium text-foreground">{(app as any).job_listings?.title ?? "Unknown"}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`capitalize ${statusStyles[app.status as AppStatus] || ""}`}>
                      {app.status}
                    </Badge>
                    <Select
                      value={app.status}
                      onValueChange={(val) => updateStatus.mutate({ id: app.id, status: val })}
                    >
                      <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s} className="capitalize text-xs">
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-3.5 h-3.5" />
                    <a href={`mailto:${app.email}`} className="hover:text-primary truncate">{app.email}</a>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{app.phone}</span>
                  </div>
                  {app.city && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{app.city}</span>
                    </div>
                  )}
                  {app.experience_years != null && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{app.experience_years} years experience</span>
                    </div>
                  )}
                  {app.education && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>{app.education}</span>
                    </div>
                  )}
                  {app.portfolio_url && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary truncate">{app.portfolio_url}</a>
                    </div>
                  )}
                </div>

                {app.cover_letter && (
                  <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground text-xs mb-1">Cover Letter</p>
                    {app.cover_letter}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  {app.cv_url && (
                    <Button variant="outline" size="sm" onClick={() => downloadCv(app.cv_url!, app.full_name)}>
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Download CV
                    </Button>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto">
                    Applied {format(new Date(app.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
