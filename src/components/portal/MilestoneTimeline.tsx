import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { format } from "date-fns";

interface MilestoneTimelineProps {
  projectId: string;
}

export function MilestoneTimeline({ projectId }: MilestoneTimelineProps) {
  const { data: milestones, isLoading } = useQuery({
    queryKey: ["project-milestones", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_milestones")
        .select("*")
        .eq("project_id", projectId)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="animate-pulse h-40 bg-muted rounded-lg" />;
  }

  if (!milestones || milestones.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          No milestones yet
        </CardContent>
      </Card>
    );
  }

  const completedCount = milestones.filter((m) => m.completed).length;
  const progress = (completedCount / milestones.length) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Project Milestones</h3>
          <p className="text-sm text-muted-foreground">
            {completedCount} of {milestones.length} completed
          </p>
        </div>
        <Badge variant={progress === 100 ? "default" : "secondary"}>
          {Math.round(progress)}% Complete
        </Badge>
      </div>

      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-3">
        {milestones.map((milestone, index) => (
          <Card key={milestone.id}>
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <div className="mt-1">
                  {milestone.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : milestone.due_date &&
                    new Date(milestone.due_date) < new Date() ? (
                    <Clock className="h-5 w-5 text-destructive" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium">{milestone.title}</h4>
                    {milestone.completed && (
                      <Badge variant="outline" className="text-success border-success">
                        Completed
                      </Badge>
                    )}
                  </div>
                  {milestone.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {milestone.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    {milestone.due_date && (
                      <span>
                        Due: {format(new Date(milestone.due_date), "MMM d, yyyy")}
                      </span>
                    )}
                    {milestone.completed_at && (
                      <span>
                        Completed:{" "}
                        {format(new Date(milestone.completed_at), "MMM d, yyyy")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
