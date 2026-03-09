import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function PortalMessages() {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const queryClient = useQueryClient();

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

  const { data: messages, isLoading } = useQuery({
    queryKey: ["portal-messages", company?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("portal_messages")
        .select("*")
        .eq("client_id", company!.id)
        .order("created_at", { ascending: true });
      return data;
    },
    enabled: !!company,
  });

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      const { error } = await supabase.from("portal_messages").insert({
        client_id: company!.id,
        sender_id: user!.id,
        message,
        is_admin: false,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portal-messages"] });
      setNewMessage("");
      toast.success("Message sent");
    },
    onError: () => {
      toast.error("Failed to send message");
    },
  });

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMessage.mutate(newMessage);
  };

  if (isLoading) {
    return <div className="p-6">Loading messages...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Communicate with the JewelIQ team</p>
      </div>

      <Card className="flex flex-col h-[calc(100vh-200px)]">
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
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
                    {msg.is_admin ? "JQ" : "You"}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`flex-1 max-w-md ${msg.is_admin ? "" : "items-end flex flex-col"}`}>
                  <div className={`rounded-lg p-3 ${msg.is_admin ? "bg-muted" : "bg-primary text-primary-foreground"}`}>
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
      </Card>
    </div>
  );
}
