import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare } from "lucide-react";

interface PortalNotificationsProps {
  companyId: string | undefined;
}

export function PortalNotifications({ companyId }: PortalNotificationsProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!companyId || !user) return;

    const channel = supabase
      .channel("portal-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "portal_messages",
          filter: `client_id=eq.${companyId}`,
        },
        (payload) => {
          const newMessage = payload.new as any;
          
          // Only show notification for messages from admin (not self)
          if (newMessage.is_admin && newMessage.sender_id !== user.id) {
            toast("New Message from JewelIQ", {
              description: newMessage.message.slice(0, 100) + (newMessage.message.length > 100 ? "..." : ""),
              icon: <MessageSquare className="h-4 w-4 text-primary" />,
              action: {
                label: "View",
                onClick: () => {
                  window.location.href = "/portal/messages";
                },
              },
            });
          }
          
          // Invalidate queries to refresh data
          queryClient.invalidateQueries({ queryKey: ["portal-messages"] });
          queryClient.invalidateQueries({ queryKey: ["client-company"] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "client_projects",
        },
        (payload) => {
          const project = payload.new as any;
          const oldProject = payload.old as any;
          
          // Notify on status changes
          if (project.status !== oldProject.status) {
            toast(`Project "${project.title}" status updated`, {
              description: `Status changed to: ${project.status.replace("_", " ")}`,
            });
          }
          
          queryClient.invalidateQueries({ queryKey: ["client-projects"] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "service_requests",
        },
        (payload) => {
          const request = payload.new as any;
          const oldRequest = payload.old as any;
          
          // Notify on status changes
          if (request.status !== oldRequest.status) {
            toast(`Service Request "${request.title}" updated`, {
              description: `Status: ${request.status}`,
            });
          }
          
          queryClient.invalidateQueries({ queryKey: ["service-requests"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [companyId, user, queryClient]);

  return null;
}
