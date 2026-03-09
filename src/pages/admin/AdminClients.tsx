import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";

export default function AdminClients() {
  const { data: clients, isLoading } = useQuery({
    queryKey: ["admin-clients"],
    queryFn: async () => {
      const { data } = await supabase
        .from("client_companies")
        .select(`
          *,
          client_projects(count)
        `)
        .order("created_at", { ascending: false });
      return data;
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading clients...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Client Companies</h1>
        <p className="text-muted-foreground">Manage registered client companies</p>
      </div>

      <div className="grid gap-4">
        {clients?.map((client) => (
          <Card key={client.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{client.company_name}</CardTitle>
                    <CardDescription>
                      Joined {format(new Date(client.created_at), "MMM d, yyyy")}
                    </CardDescription>
                  </div>
                </div>
                
                <Badge variant={client.onboarding_completed ? "default" : "secondary"}>
                  {client.onboarding_completed ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      Onboarding
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Industry</p>
                  <p className="font-medium">{client.industry || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Company Size</p>
                  <p className="font-medium">{client.company_size || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Website</p>
                  <p className="font-medium">{client.website || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Projects</p>
                  <p className="font-medium">{client.client_projects?.[0]?.count || 0}</p>
                </div>
              </div>
              
              {client.address && (
                <div className="mt-4 text-sm">
                  <p className="text-muted-foreground">Address</p>
                  <p>{client.address}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
