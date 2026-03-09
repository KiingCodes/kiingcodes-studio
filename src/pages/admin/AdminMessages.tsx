import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AdminMessages() {
  const { user } = useAuth();
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const queryClient = useQueryClient();

  const { data: clients } = useQuery({
    queryKey: ["admin-clients-list"],
    queryFn: async () => {
      const { data } = await supabase
        .from("client_companies")
        .select("*")
        .order("company_name");
      return data;
    },
  });

  const { data: messages } = useQuery({
    queryKey: ["admin-messages", selectedClient?.id],
    queryFn: async () => {
      if (!selectedClient) return [];
      const { data } = await supabase
        .from("portal_messages")
        .select("*")
        .eq("client_id", selectedClient.id)
        .order("created_at", { ascending: true });
      return data;
    },
    enabled: !!selectedClient,
  });

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      const { error } = await supabase.from("portal_messages").insert({
        client_id: selectedClient!.id,
        sender_id: user!.id,
        message,
        is_admin: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      setNewMessage("");
      toast.success("Message sent");
    },
    onError: () => {
      toast.error("Failed to send message");
    },
  });

  const handleSend = () => {
    if (!newMessage.trim() || !selectedClient) return;
    sendMessage.mutate(newMessage);
  };

  return (
    <div className="p-6 h-[calc(100vh-2rem)] flex gap-4">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Clients</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {clients?.map((client) => (
              <button
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className={`w-full p-4 text-left hover:bg-muted/50 border-b transition-colors ${
                  selectedClient?.id === client.id ? "bg-muted" : ""
                }`}
              >
                <div className="font-medium">{client.company_name}</div>
                <div className="text-sm text-muted-foreground">{client.industry || "No industry"}</div>
              </button>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="flex-1 flex flex-col">
        {selectedClient ? (
          <>
            <CardHeader>
              <CardTitle>Conversation with {selectedClient.company_name}</CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto space-y-4">
              {messages?.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No messages yet. Start the conversation!</p>
              ) : (
                messages?.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.is_admin ? "" : "flex-row-reverse"}`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={msg.is_admin ? "bg-primary text-primary-foreground" : "bg-secondary"}>
                        {msg.is_admin ? "JQ" : "CL"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`flex-1 max-w-md ${msg.is_admin ? "" : "items-end flex flex-col"}`}>
                      <div className={`rounded-lg p-3 ${msg.is_admin ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(msg.created_at), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>

            <div className="p-4 border-t flex gap-2">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="resize-none"
                rows={2}
              />
              <Button onClick={handleSend} disabled={!newMessage.trim() || sendMessage.isPending}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a client to view messages</p>
          </div>
        )}
      </Card>
    </div>
  );
}
