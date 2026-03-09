import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

export default function PortalServiceRequests() {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, setValue, watch } = useForm();

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

  const { data: requests, isLoading } = useQuery({
    queryKey: ["service-requests", company?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("service_requests")
        .select("*")
        .eq("client_id", company!.id)
        .order("created_at", { ascending: false });
      return data;
    },
    enabled: !!company,
  });

  const createRequest = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("service_requests").insert({
        ...data,
        client_id: company!.id,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: async (requestData) => {
      // Send email notification to admin
      try {
        await supabase.functions.invoke("send-notification", {
          body: {
            type: "service_request",
            to: "kiingncube@gmail.com",
            data: {
              ...requestData,
              company_name: company!.company_name,
            },
          },
        });
      } catch (error) {
        console.error("Failed to send email notification:", error);
      }
      
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
      setDialogOpen(false);
      reset();
      toast.success("Service request submitted");
    },
    onError: () => {
      toast.error("Failed to submit request");
    },
  });

  const onSubmit = (data: any) => {
    createRequest.mutate(data);
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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Service Requests</h1>
          <p className="text-muted-foreground">Submit and track service requests</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>New Service Request</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title", { required: true })} placeholder="Brief description" />
              </div>

              <div>
                <Label htmlFor="service_type">Service Type</Label>
                <Select onValueChange={(value) => setValue("service_type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web_development">Web Development</SelectItem>
                    <SelectItem value="mobile_development">Mobile Development</SelectItem>
                    <SelectItem value="ai_integration">AI Integration</SelectItem>
                    <SelectItem value="graphic_design">Graphic Design</SelectItem>
                    <SelectItem value="business_marketing">Business Marketing</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description", { required: true })}
                  placeholder="Detailed description of your needs"
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget_range">Budget Range</Label>
                  <Select onValueChange={(value) => setValue("budget_range", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under_5k">Under R5,000</SelectItem>
                      <SelectItem value="5k_10k">R5,000 - R10,000</SelectItem>
                      <SelectItem value="10k_25k">R10,000 - R25,000</SelectItem>
                      <SelectItem value="25k_50k">R25,000 - R50,000</SelectItem>
                      <SelectItem value="above_50k">Above R50,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="urgency">Urgency</Label>
                  <Select onValueChange={(value) => setValue("urgency", value)} defaultValue="normal">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createRequest.isPending}>
                  Submit Request
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {requests?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No service requests yet. Click "New Request" to get started!</p>
          </CardContent>
        </Card>
      ) : (
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
                      {request.service_type.replace("_", " ")} • {format(new Date(request.created_at), "MMM d, yyyy")}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{request.description}</p>
                
                <div className="flex gap-4 text-sm">
                  {request.budget_range && (
                    <span className="text-muted-foreground">
                      Budget: <span className="font-medium text-foreground">{request.budget_range.replace("_", " ")}</span>
                    </span>
                  )}
                  {request.urgency && (
                    <span className="text-muted-foreground">
                      Urgency: <span className="font-medium text-foreground">{request.urgency}</span>
                    </span>
                  )}
                </div>

                {request.admin_notes && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-semibold mb-1">Admin Response:</p>
                    <p className="text-sm text-muted-foreground">{request.admin_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
