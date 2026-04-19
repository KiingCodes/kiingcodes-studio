import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, Bot, Sparkles, ChevronRight, Shield, RotateCcw, Paperclip, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import owamiIcon from "@/assets/owami-bot-icon.png";
import { AnimatedBackground } from "@/components/AnimatedBackground";

type Attachment = { url: string; type: "image" | "video"; name: string };
type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  quickReplies?: string[];
  attachments?: Attachment[];
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/owami-chat`;

const VISITOR_SUGGESTIONS = [
  { label: "Turn my idea into a product", icon: Sparkles, message: "I have an idea I want to turn into a scalable product. Walk me through how JewelIQ would approach it across tech, design, business and growth." },
  { label: "See services & pricing", icon: ChevronRight, message: "What services does JewelIQ offer and what does pricing look like?" },
  { label: "Book a free consult", icon: ChevronRight, message: "I'd like to book a free consultation" },
];

const ADMIN_SUGGESTIONS = [
  { label: "Edit a page", icon: Sparkles, message: "I want to edit a page on the site — show me what's editable." },
  { label: "Create a premium blog post", icon: ChevronRight, message: "Help me draft a premium, magazine-styled blog post with a cover gradient and accent color." },
  { label: "View leads", icon: ChevronRight, message: "Show me the latest leads from the chatbot" },
  { label: "Update pricing", icon: ChevronRight, message: "Show me current pricing plans so I can update them" },
];

const VISITOR_GREETING = "Hey, I'm **Owami** ✨ — JewelIQ's AI strategist. Share an idea, problem, or product to scale and I'll map the path forward.";
const ADMIN_GREETING = "Welcome back, Chief 🛡️ **Admin Mode** active. Tell me what to ship, edit, or analyze.";

// Lightweight contextual quick replies based on the assistant's last reply
function deriveQuickReplies(lastAssistant: string, isAdmin: boolean): string[] {
  const t = lastAssistant.toLowerCase();
  if (isAdmin) {
    if (t.includes("blog")) return ["Make it more visual", "Add a cover gradient", "Publish it"];
    if (t.includes("page") || t.includes("section")) return ["Change the headline", "Add a wallpaper", "Use a fade-in animation"];
    if (t.includes("pricing") || t.includes("plan")) return ["Mark Professional as popular", "Add a new plan", "Update features"];
    if (t.includes("lead")) return ["Show qualified only", "Export as summary", "Mark as contacted"];
    return ["Edit a page", "Draft a blog post", "Show leads"];
  }
  if (t.includes("price") || t.includes("pricing") || t.includes("r1,") || t.includes("r2,") || t.includes("r5,"))
    return ["Book a consult", "What's included?", "Compare packages"];
  if (t.includes("idea") || t.includes("product") || t.includes("mvp"))
    return ["What's the timeline?", "Roughly how much?", "Book a consult"];
  if (t.includes("consult") || t.includes("book") || t.includes("contact"))
    return ["Share my details", "Open WhatsApp", "Email instead"];
  if (t.includes("?")) return ["Tell me more", "Show pricing", "Book a consult"];
  return ["Tell me more", "Show pricing", "Book a consult"];
}

function generateConversationId() {
  return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// Typewriter effect for the greeting
function TypewriterGreeting({ text, isAdmin }: { text: string; isAdmin: boolean }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, [text]);
  const isDone = displayed.length >= text.length;
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none [&_p]:my-1 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_strong]:text-foreground">
      <ReactMarkdown>{displayed}</ReactMarkdown>
      {!isDone && (
        <span className={`inline-block w-1 h-3.5 align-middle ml-0.5 animate-pulse ${isAdmin ? "bg-amber-500" : "bg-primary"}`} />
      )}
    </div>
  );
}

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
  const [conversationId, setConversationId] = useState(() => generateConversationId());
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const leadIdRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageCount = useRef(0);

  // Reset greeting when admin status changes
  useEffect(() => {
    setMessages([{ role: "assistant", content: isAdmin ? ADMIN_GREETING : VISITOR_GREETING, timestamp: new Date() }]);
    messageCount.current = 0;
    setShowLeadForm(false);
    setLeadCaptured(false);
    setPendingAttachments([]);
    leadIdRef.current = null;
    setConversationId(generateConversationId());
  }, [isAdmin]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  };
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

  // Auto-create an anonymous lead on the visitor's FIRST message; enrich later
  const ensureLeadExists = async (firstMessage: string) => {
    if (isAdmin || leadIdRef.current) return;
    try {
      const { data, error } = await supabase
        .from("chat_leads")
        .insert({
          name: "Anonymous visitor",
          email: `anon-${conversationId}@chat.local`,
          source: "owami_chatbot",
          status: "new",
          conversation_summary: `First message: ${firstMessage.slice(0, 200)}`,
        })
        .select("id")
        .single();
      if (!error && data) leadIdRef.current = data.id;
    } catch (e) {
      console.error("Failed to create lead:", e);
    }
  };

  const updateLeadSummary = async () => {
    if (!leadIdRef.current) return;
    const summary = messages
      .filter(m => m.content !== VISITOR_GREETING && m.content !== ADMIN_GREETING)
      .slice(-12)
      .map(m => `${m.role === "user" ? "User" : "Owami"}: ${m.content.slice(0, 300)}`)
      .join("\n");
    try {
      await supabase.from("chat_leads").update({ conversation_summary: summary }).eq("id", leadIdRef.current);
    } catch (e) {
      console.error("Failed to update lead summary:", e);
    }
  };

  const streamChat = useCallback(async (userMessages: Message[]) => {
    setIsLoading(true);
    let assistantSoFar = "";

    try {
      const apiMessages = userMessages
        .filter(m => m.content !== VISITOR_GREETING && m.content !== ADMIN_GREETING)
        .map(m => {
          let content = m.content;
          if (m.attachments?.length) {
            const list = m.attachments.map(a => `[${a.type === "image" ? "Image" : "Video"} attached: ${a.url}]`).join("\n");
            content = content ? `${content}\n\n${list}` : list;
          }
          return { role: m.role, content };
        });

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ messages: apiMessages, conversationId }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Failed to connect" }));
        setMessages(prev => [...prev, { role: "assistant", content: err.error || "Sorry, I'm having trouble connecting. Please try again!", timestamp: new Date() }]);
        setIsLoading(false);
        return;
      }

      const contentType = resp.headers.get("content-type") || "";

      // Admin mode returns JSON (non-streaming)
      if (contentType.includes("application/json")) {
        const data = await resp.json();
        const content = data.content || "Done! ✨";
        setMessages(prev => [...prev, { role: "assistant", content, timestamp: new Date(), quickReplies: deriveQuickReplies(content, true) }]);
        if (data.admin) {
          queryClient.invalidateQueries();
        }
        setIsLoading(false);
        return;
      }

      // Visitor mode: streaming SSE
      if (!resp.body) {
        setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting.", timestamp: new Date() }]);
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
              const snapshot = assistantSoFar;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && last.content !== VISITOR_GREETING && last.content !== ADMIN_GREETING) {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: snapshot } : m);
                }
                return [...prev, { role: "assistant", content: snapshot, timestamp: new Date() }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // After stream completes, attach contextual quick replies
      if (assistantSoFar) {
        setMessages(prev => prev.map((m, i) =>
          i === prev.length - 1 && m.role === "assistant"
            ? { ...m, quickReplies: deriveQuickReplies(assistantSoFar, false) }
            : m
        ));
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Oops! Something went wrong. Please try again.", timestamp: new Date() }]);
    }
    setIsLoading(false);
    // Update lead summary in background after each turn
    setTimeout(() => { updateLeadSummary(); }, 800);
  }, [session, queryClient, conversationId]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if ((!trimmed && pendingAttachments.length === 0) || isLoading) return;

    const userMsg: Message = {
      role: "user",
      content: trimmed,
      timestamp: new Date(),
      attachments: pendingAttachments.length ? pendingAttachments : undefined,
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setPendingAttachments([]);
    messageCount.current += 1;

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Lead-on-first-message (visitor only)
    if (!isAdmin && messageCount.current === 1) {
      ensureLeadExists(trimmed || "(media only)");
    }

    // Optional explicit lead form after a few messages
    if (!isAdmin && messageCount.current >= 3 && !leadCaptured && !showLeadForm) {
      setShowLeadForm(true);
    }

    await streamChat(updatedMessages);
  };

  const handleLeadSubmit = async () => {
    if (!leadData.name || !leadData.email) return;
    try {
      if (leadIdRef.current) {
        await supabase
          .from("chat_leads")
          .update({
            name: leadData.name,
            email: leadData.email,
            phone: leadData.phone || null,
            company: leadData.company || null,
            status: "qualified",
          })
          .eq("id", leadIdRef.current);
      } else {
        const { data } = await supabase
          .from("chat_leads")
          .insert({
            name: leadData.name,
            email: leadData.email,
            phone: leadData.phone || null,
            company: leadData.company || null,
          })
          .select("id")
          .single();
        if (data) leadIdRef.current = data.id;
      }
    } catch (e) {
      console.error("Failed to save lead:", e);
    }
    setLeadCaptured(true);
    setShowLeadForm(false);
    const leadMsg = `Great to meet you, ${leadData.name}! I've noted your details. How can I help you further? 😊`;
    setMessages(prev => [...prev, { role: "assistant", content: leadMsg, timestamp: new Date(), quickReplies: ["Tell me more", "Show pricing", "Book a consult"] }]);
  };

  const handleNewChat = () => {
    setMessages([{ role: "assistant", content: isAdmin ? ADMIN_GREETING : VISITOR_GREETING, timestamp: new Date() }]);
    messageCount.current = 0;
    setConversationId(generateConversationId());
    setShowLeadForm(false);
    setPendingAttachments([]);
    leadIdRef.current = null;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  // Admin-only: upload a file to client-media and add to pending attachments
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const newAttachments: Attachment[] = [];
      for (const file of Array.from(files)) {
        if (file.size > 25 * 1024 * 1024) {
          console.warn("File too large:", file.name);
          continue;
        }
        const isVideo = file.type.startsWith("video/");
        const isImage = file.type.startsWith("image/");
        if (!isVideo && !isImage) continue;
        const ext = file.name.split(".").pop() || "bin";
        const path = `owami/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("client-media").upload(path, file, {
          contentType: file.type,
          upsert: false,
        });
        if (upErr) {
          console.error("Upload failed:", upErr);
          continue;
        }
        const { data: pub } = supabase.storage.from("client-media").getPublicUrl(path);
        // Register in media library
        await supabase.from("media_uploads").insert({
          uploaded_by: user?.id ?? null,
          file_path: path,
          public_url: pub.publicUrl,
          file_type: isVideo ? "video" : "image",
          mime_type: file.type,
          file_size_bytes: file.size,
        });
        newAttachments.push({ url: pub.publicUrl, type: isVideo ? "video" : "image", name: file.name });
      }
      setPendingAttachments(prev => [...prev, ...newAttachments]);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (idx: number) => {
    setPendingAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  const suggestions = isAdmin ? ADMIN_SUGGESTIONS : VISITOR_SUGGESTIONS;

  const formatTime = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="chat-trigger-btn"
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
            key="chat-window"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[650px] max-h-[calc(100vh-3rem)] rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-primary/30 border border-border/50 bg-background/80 backdrop-blur-xl"
          >
            {/* Animated brand wallpaper */}
            <AnimatedBackground variant="panel" className="z-0" />

            {/* Header */}
            <div className={`relative px-5 py-3.5 border-b border-border/40 flex items-center gap-3 backdrop-blur-md ${
              isAdmin ? "bg-gradient-to-r from-amber-500/10 via-primary/5 to-accent/10" : "bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10"
            }`}>
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                    isAdmin ? "bg-gradient-to-br from-amber-500 to-primary shadow-amber-500/30" : "bg-gradient-to-br from-primary to-accent shadow-primary/30"
                  }`}
                >
                  <img src={owamiIcon} alt="Owami" className="w-6 h-6 object-contain" />
                </motion.div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background">
                  <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  Owami
                  {isAdmin && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-semibold flex items-center gap-1 border border-amber-500/30">
                      <Shield className="w-2.5 h-2.5" /> ADMIN
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {isAdmin ? "Admin Mode • Full Access" : "AI Strategist • Online"}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleNewChat} className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all" title="New conversation">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-thin">
              {messages.map((msg, i) => {
                const isGreeting = i === 0 && msg.role === "assistant" && (msg.content === VISITOR_GREETING || msg.content === ADMIN_GREETING);
                const isLast = i === messages.length - 1;
                return (
                <motion.div
                  key={`${i}-${msg.content.slice(0, 20)}`}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: isLast ? 0.05 : 0 }}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} mb-4`}
                >
                  <div className={`flex items-center gap-1.5 mb-1.5 px-1 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    {msg.role === "assistant" ? (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${
                        isAdmin ? "bg-gradient-to-br from-amber-500/30 to-primary/20" : "bg-gradient-to-br from-primary/30 to-accent/20"
                      }`}>
                        <img src={owamiIcon} alt="" className="w-3.5 h-3.5 object-contain" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center shadow-sm">
                        <User className="w-3 h-3 text-primary" />
                      </div>
                    )}
                    <span className="text-[10px] text-muted-foreground font-semibold tracking-wide">
                      {msg.role === "assistant" ? "Owami" : "You"}
                    </span>
                    <span className="text-[10px] text-muted-foreground/50">{formatTime(msg.timestamp)}</span>
                  </div>

                  <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-md shadow-primary/20"
                      : "bg-gradient-to-br from-muted/60 to-muted/30 text-foreground rounded-bl-md border border-border/40 backdrop-blur-sm"
                  }`}>
                    {msg.role === "assistant" ? (
                      isGreeting ? (
                        <TypewriterGreeting text={msg.content} isAdmin={isAdmin} />
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none [&_p]:my-1 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_ul]:my-1.5 [&_ol]:my-1.5 [&_li]:my-0.5 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_code]:text-xs [&_code]:bg-secondary/50 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_pre]:bg-secondary/50 [&_pre]:rounded-lg [&_pre]:p-3 [&_blockquote]:border-primary/30 [&_a]:text-primary [&_strong]:text-foreground">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      )
                    ) : (
                      <>
                        {msg.content && <span className="whitespace-pre-wrap">{msg.content}</span>}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className={`grid gap-2 ${msg.content ? "mt-2" : ""}`}>
                            {msg.attachments.map((att, ai) =>
                              att.type === "image" ? (
                                <img key={ai} src={att.url} alt={att.name} className="rounded-lg max-h-48 w-auto object-cover border border-primary-foreground/20" />
                              ) : (
                                <video key={ai} src={att.url} controls className="rounded-lg max-h-48 w-full border border-primary-foreground/20" />
                              )
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Contextual quick replies */}
                  {msg.role === "assistant" && msg.quickReplies && msg.quickReplies.length > 0 && isLast && !isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="flex flex-wrap gap-1.5 mt-2 ml-7"
                    >
                      {msg.quickReplies.map((qr) => (
                        <motion.button
                          key={qr}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => sendMessage(qr)}
                          className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 text-foreground hover:from-primary/20 hover:to-accent/20 hover:border-primary/50 hover:shadow-sm hover:shadow-primary/20 transition-all cursor-pointer"
                        >
                          {qr}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
                );
              })}

              {/* Typing indicator */}
              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-1.5 mb-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isAdmin ? "bg-amber-500/20" : "bg-primary/20"
                  }`}>
                    <img src={owamiIcon} alt="" className="w-3.5 h-3.5 object-contain" />
                  </div>
                  <div className="bg-muted/50 rounded-2xl rounded-bl-sm px-4 py-3 border border-border/30">
                    <div className="flex gap-1.5 items-center">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-2 h-2 rounded-full bg-primary/50" animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Lead form - visitor only */}
              <AnimatePresence>
                {showLeadForm && !leadCaptured && !isAdmin && (
                  <motion.div
                    key="lead-form"
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-xl p-4 space-y-3"
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

              {/* Initial suggestions (only for first greeting) */}
              {messages.length === 1 && !isLoading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col gap-2 pt-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold px-1 mb-0.5">Quick start</p>
                  {suggestions.map((s, i) => (
                    <motion.button
                      key={s.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.08 }}
                      whileHover={{ x: 2, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => sendMessage(s.message)}
                      className="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium bg-gradient-to-br from-muted/40 to-muted/20 border border-border/40 text-foreground hover:from-primary/10 hover:to-accent/10 hover:border-primary/40 hover:shadow-md hover:shadow-primary/10 transition-all duration-200 text-left cursor-pointer"
                    >
                      <span className="w-7 h-7 rounded-lg bg-primary/15 group-hover:bg-primary/25 flex items-center justify-center flex-shrink-0 transition-colors">
                        <s.icon className="w-3.5 h-3.5 text-primary" />
                      </span>
                      <span className="flex-1">{s.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </motion.button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Pending attachments preview (admin) */}
            {isAdmin && pendingAttachments.length > 0 && (
              <div className="px-3 pt-2 border-t border-border/40 bg-muted/20 flex gap-2 flex-wrap">
                {pendingAttachments.map((att, i) => (
                  <div key={i} className="relative group">
                    {att.type === "image" ? (
                      <img src={att.url} alt={att.name} className="h-12 w-12 object-cover rounded-lg border border-border/40" />
                    ) : (
                      <div className="h-12 w-12 rounded-lg border border-border/40 bg-muted flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <button
                      onClick={() => removeAttachment(i)}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-90 hover:opacity-100"
                      aria-label="Remove attachment"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input area */}
            <div className="p-3 border-t border-border/40 bg-gradient-to-b from-muted/10 to-muted/30 backdrop-blur-sm">
              <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex items-end gap-2">
                {/* Admin-only file upload */}
                {isAdmin && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      disabled={isUploading || isLoading}
                      onClick={() => fileInputRef.current?.click()}
                      className="h-[42px] w-[42px] rounded-xl flex-shrink-0 border-border/40"
                      title="Attach image or video"
                    >
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                    </Button>
                  </>
                )}
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleTextareaInput}
                  onKeyDown={handleKeyDown}
                  placeholder={isAdmin ? "Tell Owami what to update or attach media..." : "Share your idea or ask anything..."}
                  className="flex-1 min-h-[42px] max-h-[120px] resize-none rounded-xl border border-border/40 bg-background/80 backdrop-blur-sm px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 focus:bg-background transition-all shadow-sm"
                  disabled={isLoading}
                  rows={1}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={(!input.trim() && pendingAttachments.length === 0) || isLoading}
                  className="h-[42px] w-[42px] rounded-xl bg-gradient-to-br from-primary to-accent hover:shadow-lg hover:shadow-primary/30 disabled:opacity-40 disabled:shadow-none transition-all flex-shrink-0 group"
                >
                  <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
              </form>
              <p className="text-[10px] text-muted-foreground/50 text-center mt-1.5">Powered by JewelIQ • Owami AI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
