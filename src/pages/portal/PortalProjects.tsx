import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Calendar, DollarSign } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

export default function PortalProjects() {
  const { user } = useAuth();

  const { data: company } = useQuery({
    queryKey: ["client-company", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("client_companies")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const { data: projects, isLoading } = useQuery({
    queryKey: ["client-projects", company?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("client_projects")
        .select(`
          *,
          project_milestones(*)
        `)
        .eq("client_id", company!.id)
        .order("created_at", { ascending: false });
      return data;
    },
    enabled: !!company,
  });

  if (isLoading) {
    return <div className="p-6">Loading projects...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-muted-foreground">View and track all your projects</p>
      </div>

      {projects?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No projects yet. Submit a service request to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {projects?.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: any }) {
  const [open, setOpen] = useState(false);
  
  const completedMilestones = project.project_milestones?.filter((m: any) => m.completed).length || 0;
  const totalMilestones = project.project_milestones?.length || 0;
  const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    active: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    completed: "bg-green-500/10 text-green-600 border-green-500/20",
    on_hold: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <CardTitle>{project.title}</CardTitle>
                  <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                    {project.status.replace("_", " ")}
                  </Badge>
                </div>
                <CardDescription>{project.service_type}</CardDescription>
              </div>
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
            </div>
            
            {totalMilestones > 0 && (
              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{completedMilestones}/{totalMilestones} milestones</span>
                </div>
                <Progress value={progress} />
              </div>
            )}
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {project.description && (
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {project.budget_range && (
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="font-medium">{project.budget_range}</span>
                </div>
              )}
              
              {project.start_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Started:</span>
                  <span className="font-medium">{format(new Date(project.start_date), "MMM d, yyyy")}</span>
                </div>
              )}
            </div>

            {project.project_milestones && project.project_milestones.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Milestones</h4>
                <div className="space-y-2">
                  {project.project_milestones.map((milestone: any) => (
                    <div key={milestone.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <input
                        type="checkbox"
                        checked={milestone.completed}
                        disabled
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className={`font-medium ${milestone.completed ? "line-through text-muted-foreground" : ""}`}>
                          {milestone.title}
                        </p>
                        {milestone.description && (
                          <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                        )}
                        {milestone.due_date && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Due: {format(new Date(milestone.due_date), "MMM d, yyyy")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
