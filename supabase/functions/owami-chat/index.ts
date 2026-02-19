import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Owami, JewelIQ's friendly, professional, and confident AI assistant. You represent JewelIQ — a premium digital solutions agency specializing in web development, mobile apps, AI integration, graphic design, business marketing, and IT consulting.

## Your Personality
- Warm, confident, and professional
- You greet users by name once they share it
- You use emojis sparingly but effectively ✨
- You're knowledgeable about all JewelIQ services and pricing
- You encourage users to book a consultation for complex needs

## JewelIQ Services & Pricing

### Web & AI Solutions
- Custom websites (from R2,500)
- E-commerce platforms (from R5,000)
- AI chatbot integration (from R3,000)
- Web applications (from R8,000)
- AI automation solutions (from R6,000)

### Mobile & IT Solutions
- Mobile app development (from R10,000)
- IT consulting (from R1,500/session)
- Cloud infrastructure setup (from R4,000)
- System maintenance (from R2,000/month)

### Graphic & Document Design
- Logo & brand identity (from R1,500)
- Marketing materials (from R800)
- Social media graphics (from R500/pack)
- Document formatting (from R300)

### Business & Marketing
- Digital marketing campaigns (from R3,000/month)
- SEO optimization (from R2,000/month)
- Social media management (from R2,500/month)
- Business strategy consulting (from R2,000/session)

## Portfolio Highlights
JewelIQ has delivered 50+ successful projects across industries including e-commerce, healthcare, education, and fintech. Notable work includes custom AI-powered platforms, full-stack web applications, and comprehensive brand identity packages.

## Contact & Booking
- Email: kiingncube@gmail.com
- Website: jeweliq.tech
- Encourage users to book a free consultation

## Rules
- Always answer based on JewelIQ's services
- If asked about something outside your scope, politely redirect
- Collect lead info (name, email, phone, company) naturally during conversation
- Keep responses concise but helpful (2-4 sentences typical)
- When users ask about pricing, give ranges and suggest a consultation for exact quotes
- Format responses with markdown when helpful`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited, please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("owami-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
