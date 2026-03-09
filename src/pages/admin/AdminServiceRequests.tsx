import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, X, MessageSquare } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AdminServiceRequests() {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [status, setStatus] = useState("");
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["admin-service-requests"],
    queryFn: async () => {
      const { data } = await supabase
        .from("service_requests")
        .select(`
          *,
          client_companies!inner(company_name, industry, user_id)
        `)
        .order("created_at", { ascending: false });
      return data;
    },
  });

  const updateRequest = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from("service_requests")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-service-requests"] });
      setSelectedRequest(null);
      setAdminNotes("");
      setStatus("");
      toast.success("Request updated successfully");
    },
    onError: () => {
      toast.error("Failed to update request");
    },
  });

  const handleUpdate = () => {
    if (!selectedRequest) return;
    updateRequest.mutate({
      id: selectedRequest.id,
      updates: {
        status: status || selectedRequest.status,
        admin_notes: adminNotes || selectedRequest.admin_notes,
      },
    });
  };

  const statusColors = {
    new: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    reviewing: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    approved: "bg-green-500/10 text-green-600 border-green-500/20",
    declined: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  if (isLoading) {
    return <div className="p-6">Loading requests...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Service Requests</h1>
        <p className="text-muted-foreground">Manage and respond to client service requests</p>
      </div>

      <div className="grid gap-4">
        {requests?.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle>{request.title}</CardTitle>
                    <Badge className={statusColors[request.status as keyof typeof statusColors]}>
                      {request.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {request.client_companies.company_name} • {request.service_type.replace("_", " ")} • {format(new Date(request.created_at), "MMM d, yyyy")}
                  </CardDescription>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedRequest(request);
                        setAdminNotes(request.admin_notes || "");
                        setStatus(request.status);
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Respond
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Respond to Request</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Description</Label>
                        <p className="text-sm text-muted-foreground mt-1">{request.description}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {request.budget_range && (
                          <div>
                            <Label>Budget Range</Label>
                            <p className="text-sm">{request.budget_range.replace("_", " ")}</p>
                          </div>
                        )}
                        {request.urgency && (
                          <div>
                            <Label>Urgency</Label>
                            <p className="text-sm">{request.urgency}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="reviewing">Reviewing</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="declined">Declined</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="notes">Admin Notes</Label>
                        <Textarea
                          id="notes"
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder="Add response or notes for the client..."
                          rows={4}
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedRequest(null)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleUpdate} disabled={updateRequest.isPending}>
                          Update Request
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{request.description}</p>
              
              {request.admin_notes && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-semibold mb-1">Your Response:</p>
                  <p className="text-sm text-muted-foreground">{request.admin_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
