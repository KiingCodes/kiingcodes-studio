import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MessageSquare, Users, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [requests, messages, clients] = await Promise.all([
        supabase.from("service_requests").select("*", { count: "exact", head: true }),
        supabase.from("portal_messages").select("*", { count: "exact", head: true }),
        supabase.from("client_companies").select("*", { count: "exact", head: true }),
      ]);

      const pendingRequests = await supabase
        .from("service_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "new");

      return {
        totalRequests: requests.count || 0,
        totalMessages: messages.count || 0,
        totalClients: clients.count || 0,
        pendingRequests: pendingRequests.count || 0,
      };
    },
  });

  const statCards = [
    {
      title: "Pending Requests",
      value: stats?.pendingRequests || 0,
      icon: FileText,
      description: "New service requests",
      color: "text-orange-600",
    },
    {
      title: "Total Messages",
      value: stats?.totalMessages || 0,
      icon: MessageSquare,
      description: "Client communications",
      color: "text-blue-600",
    },
    {
      title: "Total Clients",
      value: stats?.totalClients || 0,
      icon: Users,
      description: "Registered companies",
      color: "text-green-600",
    },
    {
      title: "All Requests",
      value: stats?.totalRequests || 0,
      icon: TrendingUp,
      description: "Total service requests",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of client portal activity</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
