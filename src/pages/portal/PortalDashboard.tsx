import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, MessageSquare, FileText, Receipt } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function PortalDashboard() {
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

  const { data: projects } = useQuery({
    queryKey: ["client-projects", company?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("client_projects")
        .select("*")
        .eq("client_id", company!.id);
      return data || [];
    },
    enabled: !!company,
  });

  const { data: messages } = useQuery({
    queryKey: ["portal-messages", company?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("portal_messages")
        .select("*")
        .eq("client_id", company!.id)
        .is("read_at", null);
      return data || [];
    },
    enabled: !!company,
  });

  const { data: requests } = useQuery({
    queryKey: ["service-requests", company?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("service_requests")
        .select("*")
        .eq("client_id", company!.id);
      return data || [];
    },
    enabled: !!company,
  });

  const activeProjects = projects?.filter((p) => p.status === "active") || [];

  const stats = [
    {
      title: "Active Projects",
      value: activeProjects.length,
      icon: FolderKanban,
      link: "/portal/projects",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Unread Messages",
      value: messages?.length || 0,
      icon: MessageSquare,
      link: "/portal/messages",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Service Requests",
      value: requests?.length || 0,
      icon: FileText,
      link: "/portal/requests",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back{company?.company_name ? `, ${company.company_name}` : ""}!</h1>
        <p className="text-muted-foreground">Here's an overview of your projects and activity</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {activeProjects.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No active projects</p>
          ) : (
            <div className="space-y-3">
              {activeProjects.map((project) => (
                <Link
                  key={project.id}
                  to="/portal/projects"
                  className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">{project.service_type}</p>
                    </div>
                    <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                      {project.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
