import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, Bot, Sparkles, ChevronRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import owamiIcon from "@/assets/owami-bot-icon.png";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/owami-chat`;

const VISITOR_SUGGESTIONS = [
  { label: "Services", icon: Sparkles, message: "What services does JewelIQ offer?" },
  { label: "Pricing", icon: ChevronRight, message: "Can you tell me about JewelIQ's pricing?" },
  { label: "Book Consultation", icon: ChevronRight, message: "I'd like to book a free consultation" },
];

const ADMIN_SUGGESTIONS = [
  { label: "View Leads", icon: Sparkles, message: "Show me the latest leads from the chatbot" },
  { label: "Add Blog Post", icon: ChevronRight, message: "I want to create a new blog post" },
  { label: "Update Pricing", icon: ChevronRight, message: "Show me current pricing plans so I can update them" },
  { label: "Add Portfolio", icon: ChevronRight, message: "I want to add a new portfolio item" },
];

const VISITOR_GREETING = "Hey there! ✨ I'm **Owami**, your JewelIQ assistant. I can help you explore our services, get pricing info, or book a consultation. What can I help you with today?";
const ADMIN_GREETING = "Welcome back, Admin! 🛡️ I'm **Owami** in **Admin Mode**. I can help you manage your website — update services, pricing, blog posts, portfolio items, and view leads. What would you like to do?";

export function OwamaChatbot() {
  const { user, isAdmin, session } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadData, setLeadData] = useState({ name: "", email: "", phone: "", company: "" });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageCount = useRef(0);

  // Reset greeting when admin status changes
  useEffect(() => {
    setMessages([{ role: "assistant", content: isAdmin ? ADMIN_GREETING : VISITOR_GREETING }]);
    messageCount.current = 0;
    setShowLeadForm(false);
    setLeadCaptured(false);
  }, [isAdmin]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    };
    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }
    return headers;
  };

  const streamChat = useCallback(async (userMessages: Message[]) => {
    setIsLoading(true);
    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ messages: userMessages }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Failed to connect" }));
        setMessages(prev => [...prev, { role: "assistant", content: err.error || "Sorry, I'm having trouble connecting. Please try again!" }]);
        setIsLoading(false);
        return;
      }

      const contentType = resp.headers.get("content-type") || "";

      // Admin mode returns JSON (non-streaming)
      if (contentType.includes("application/json")) {
        const data = await resp.json();
        setMessages(prev => [...prev, { role: "assistant", content: data.content || "Done! ✨" }]);
        // Invalidate queries so dynamic content refreshes
        if (data.admin) {
          queryClient.invalidateQueries();
        }
        setIsLoading(false);
        return;
      }

      // Visitor mode: streaming SSE
      if (!resp.body) {
        setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting." }]);
        setIsLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && prev.length > 1 && last.content !== VISITOR_GREETING && last.content !== ADMIN_GREETING) {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Oops! Something went wrong. Please try again." }]);
    }
    setIsLoading(false);
  }, [session, queryClient]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    messageCount.current += 1;

    if (!isAdmin && messageCount.current >= 3 && !leadCaptured && !showLeadForm) {
      setShowLeadForm(true);
    }

    await streamChat(updatedMessages);
  };

  const handleLeadSubmit = async () => {
    if (!leadData.name || !leadData.email) return;
    
    // Save lead to database
    try {
      await supabase.from("chat_leads").insert({
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone || null,
        company: leadData.company || null,
      });
    } catch (e) {
      console.error("Failed to save lead:", e);
    }

    setLeadCaptured(true);
    setShowLeadForm(false);
    const leadMsg = `Great to meet you, ${leadData.name}! I've noted your details. How can I help you further? 😊`;
    setMessages(prev => [...prev, { role: "assistant", content: leadMsg }]);
  };

  const suggestions = isAdmin ? ADMIN_SUGGESTIONS : VISITOR_SUGGESTIONS;

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30 flex items-center justify-center cursor-pointer group"
          >
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
              <img src={owamiIcon} alt="Owami" className="w-8 h-8 object-contain" />
            </motion.div>
            <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            {isAdmin && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                <Shield className="w-3 h-3 text-white" />
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-3rem)] rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-primary/20 border border-border/50"
            style={{ background: "hsl(222 47% 7%)" }}
          >
            {/* Header */}
            <div className={`relative px-5 py-4 border-b border-border/30 flex items-center gap-3 ${
              isAdmin ? "bg-gradient-to-r from-amber-500/20 to-primary/20" : "bg-gradient-to-r from-primary/20 to-accent/20"
            }`}>
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isAdmin ? "bg-gradient-to-br from-amber-500 to-primary" : "bg-gradient-to-br from-primary to-accent"
                }`}>
                  <img src={owamiIcon} alt="Owami" className="w-6 h-6 object-contain" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background" style={{ background: "hsl(142, 71%, 45%)" }} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  Owami
                  {isAdmin && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-medium flex items-center gap-1">
                      <Shield className="w-2.5 h-2.5" /> ADMIN
                    </span>
                  )}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isAdmin ? "Admin Mode • Full Access" : "JewelIQ AI Assistant • Online"}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: i === messages.length - 1 ? 0.1 : 0 }}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                      isAdmin ? "bg-gradient-to-br from-amber-500/30 to-primary/30" : "bg-gradient-to-br from-primary/30 to-accent/30"
                    }`}>
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-br-md"
                      : "bg-secondary/60 text-foreground rounded-bl-md border border-border/30"
                  }`}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&_p]:m-0 [&_ul]:my-1 [&_li]:my-0.5">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-start">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="bg-secondary/60 rounded-2xl rounded-bl-md px-4 py-3 border border-border/30">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-2 h-2 rounded-full bg-primary/60" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Lead form - visitor only */}
              <AnimatePresence>
                {showLeadForm && !leadCaptured && !isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <p className="text-xs font-medium text-foreground">Share your details for a personalized experience</p>
                    </div>
                    <div className="space-y-2">
                      <Input placeholder="Your name *" value={leadData.name} onChange={e => setLeadData(d => ({ ...d, name: e.target.value }))} className="h-8 text-xs bg-background/50 border-border/40" />
                      <Input placeholder="Email address *" type="email" value={leadData.email} onChange={e => setLeadData(d => ({ ...d, email: e.target.value }))} className="h-8 text-xs bg-background/50 border-border/40" />
                      <Input placeholder="Phone (optional)" value={leadData.phone} onChange={e => setLeadData(d => ({ ...d, phone: e.target.value }))} className="h-8 text-xs bg-background/50 border-border/40" />
                      <Input placeholder="Company (optional)" value={leadData.company} onChange={e => setLeadData(d => ({ ...d, company: e.target.value }))} className="h-8 text-xs bg-background/50 border-border/40" />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="h-7 text-xs flex-1" onClick={handleLeadSubmit}>Submit</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setShowLeadForm(false)}>Skip</Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Suggestions */}
              {messages.length === 1 && !isLoading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="grid grid-cols-2 gap-2">
                  {suggestions.map((s, i) => (
                    <motion.button
                      key={s.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      onClick={() => sendMessage(s.message)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium bg-secondary/40 border border-border/30 text-foreground hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 text-left cursor-pointer"
                    >
                      <s.icon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      {s.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border/30 bg-background/50">
              <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={isAdmin ? "Tell Owami what to update..." : "Ask Owami anything..."}
                  className="flex-1 h-10 text-sm bg-secondary/30 border-border/30 rounded-xl"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent hover:opacity-90">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <p className="text-[10px] text-muted-foreground text-center mt-2 opacity-60">
                {isAdmin ? "🛡️ Admin Mode — Changes are live" : "Powered by JewelIQ AI ✨"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
