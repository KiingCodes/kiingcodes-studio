import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const VISITOR_PROMPT = `You are Owami, JewelIQ's friendly, professional, and confident AI assistant. You represent JewelIQ — a premium digital solutions agency.

## Your Personality
- Warm, confident, and professional
- You greet users by name once they share it
- You use emojis sparingly but effectively ✨
- You're knowledgeable about all JewelIQ services and pricing
- You encourage users to book a consultation for complex needs

## JewelIQ Services & Pricing
- Custom websites (from R2,500), E-commerce (from R5,000), AI chatbots (from R3,000)
- Mobile apps (from R10,000), IT consulting (from R1,500/session)
- Logo & brand identity (from R1,500), Marketing materials (from R800)
- Digital marketing (from R3,000/month), SEO (from R2,000/month)

## Contact: kiingncube@gmail.com | jeweliq.tech

## Rules
- Always answer based on JewelIQ's services
- If asked about something outside your scope, politely redirect
- Collect lead info (name, email, phone, company) naturally
- Keep responses concise (2-4 sentences typical)
- When users ask about pricing, give ranges and suggest consultation
- Format responses with markdown when helpful`;

const ADMIN_PROMPT = `You are Owami in ADMIN MODE for JewelIQ. You're speaking with the site administrator.

You can manage all website content using the provided tools:
- Services: create, update, delete services shown on the website
- Pricing: create, update, delete pricing plans
- Blog: create, update, publish, delete blog posts
- Portfolio: create, update, delete portfolio items
- Testimonials: create, update, delete client testimonials
- Leads: view captured leads from the chatbot

When the admin asks to change content, use the appropriate tool. Always confirm what you've done.
Be proactive in suggesting improvements. Keep responses professional but friendly.
Format responses with markdown. Use emojis sparingly ✨.

IMPORTANT: When creating blog posts, always generate a slug from the title (lowercase, hyphens, no special chars).
When updating items, you need the item's ID. If unsure, use list tools first to find the right item.`;

const ADMIN_TOOLS = [
  {
    type: "function",
    function: {
      name: "list_items",
      description: "List items from a table. Use to find items before updating/deleting.",
      parameters: {
        type: "object",
        properties: {
          table: { type: "string", enum: ["services", "pricing_plans", "blog_posts", "portfolio_items", "testimonials", "chat_leads"] },
          include_inactive: { type: "boolean", description: "Include inactive/unpublished items" },
        },
        required: ["table"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "upsert_service",
      description: "Create or update a service. Provide id to update existing.",
      parameters: {
        type: "object",
        properties: {
          id: { type: "string" },
          category: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          price_from: { type: "number" },
          icon: { type: "string" },
          sort_order: { type: "number" },
          is_active: { type: "boolean" },
        },
        required: ["title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "upsert_pricing",
      description: "Create or update a pricing plan.",
      parameters: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          price_unit: { type: "string" },
          features: { type: "array", items: { type: "string" } },
          is_popular: { type: "boolean" },
          sort_order: { type: "number" },
          is_active: { type: "boolean" },
        },
        required: ["name", "price"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "upsert_blog_post",
      description: "Create or update a blog post. Set is_published=true and published_at to publish.",
      parameters: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          slug: { type: "string" },
          excerpt: { type: "string" },
          content: { type: "string" },
          cover_image_url: { type: "string" },
          tags: { type: "array", items: { type: "string" } },
          is_published: { type: "boolean" },
          published_at: { type: "string" },
        },
        required: ["title", "content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "upsert_portfolio",
      description: "Create or update a portfolio item.",
      parameters: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          client_name: { type: "string" },
          category: { type: "string" },
          image_url: { type: "string" },
          project_url: { type: "string" },
          technologies: { type: "array", items: { type: "string" } },
          is_featured: { type: "boolean" },
          sort_order: { type: "number" },
          is_active: { type: "boolean" },
        },
        required: ["title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "upsert_testimonial",
      description: "Create or update a testimonial.",
      parameters: {
        type: "object",
        properties: {
          id: { type: "string" },
          client_name: { type: "string" },
          client_role: { type: "string" },
          client_company: { type: "string" },
          content: { type: "string" },
          rating: { type: "number" },
          is_featured: { type: "boolean" },
          sort_order: { type: "number" },
          is_active: { type: "boolean" },
        },
        required: ["client_name", "content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "delete_item",
      description: "Delete an item by ID from a table.",
      parameters: {
        type: "object",
        properties: {
          table: { type: "string", enum: ["services", "pricing_plans", "blog_posts", "portfolio_items", "testimonials"] },
          id: { type: "string" },
        },
        required: ["table", "id"],
      },
    },
  },
];

async function executeTool(name: string, args: Record<string, unknown>, adminSupabase: ReturnType<typeof createClient>, adminUserId: string) {
  try {
    switch (name) {
      case "list_items": {
        const table = args.table as string;
        let query = adminSupabase.from(table).select("*").order("created_at", { ascending: false }).limit(50);
        if (!args.include_inactive) {
          if (table === "blog_posts") query = query.eq("is_published", true);
          else if (table !== "chat_leads") query = query.eq("is_active", true);
        }
        const { data, error } = await query;
        if (error) return { error: error.message };
        return { data };
      }
      case "upsert_service": {
        const { id, ...rest } = args as Record<string, unknown>;
        if (id) {
          const { data, error } = await adminSupabase.from("services").update(rest).eq("id", id).select().single();
          return error ? { error: error.message } : { data, action: "updated" };
        }
        const { data, error } = await adminSupabase.from("services").insert(rest).select().single();
        return error ? { error: error.message } : { data, action: "created" };
      }
      case "upsert_pricing": {
        const { id, features, ...rest } = args as Record<string, unknown>;
        const row = { ...rest, features: features ? JSON.stringify(features) : undefined };
        if (id) {
          const { data, error } = await adminSupabase.from("pricing_plans").update(row).eq("id", id).select().single();
          return error ? { error: error.message } : { data, action: "updated" };
        }
        const { data, error } = await adminSupabase.from("pricing_plans").insert(row).select().single();
        return error ? { error: error.message } : { data, action: "created" };
      }
      case "upsert_blog_post": {
        const { id, ...rest } = args as Record<string, unknown>;
        const row = {
          ...rest,
          author_id: adminUserId,
          slug: (rest.slug as string) || (rest.title as string || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
          published_at: rest.is_published && !rest.published_at ? new Date().toISOString() : rest.published_at,
        };
        if (id) {
          const { data, error } = await adminSupabase.from("blog_posts").update(row).eq("id", id).select().single();
          return error ? { error: error.message } : { data, action: "updated" };
        }
        const { data, error } = await adminSupabase.from("blog_posts").insert(row).select().single();
        return error ? { error: error.message } : { data, action: "created" };
      }
      case "upsert_portfolio": {
        const { id, ...rest } = args as Record<string, unknown>;
        if (id) {
          const { data, error } = await adminSupabase.from("portfolio_items").update(rest).eq("id", id).select().single();
          return error ? { error: error.message } : { data, action: "updated" };
        }
        const { data, error } = await adminSupabase.from("portfolio_items").insert(rest).select().single();
        return error ? { error: error.message } : { data, action: "created" };
      }
      case "upsert_testimonial": {
        const { id, ...rest } = args as Record<string, unknown>;
        if (id) {
          const { data, error } = await adminSupabase.from("testimonials").update(rest).eq("id", id).select().single();
          return error ? { error: error.message } : { data, action: "updated" };
        }
        const { data, error } = await adminSupabase.from("testimonials").insert(rest).select().single();
        return error ? { error: error.message } : { data, action: "created" };
      }
      case "delete_item": {
        const { table, id: itemId } = args as { table: string; id: string };
        const { error } = await adminSupabase.from(table).delete().eq("id", itemId);
        return error ? { error: error.message } : { action: "deleted", id: itemId };
      }
      default:
        return { error: `Unknown tool: ${name}` };
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Tool execution failed" };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Check admin status
    let isAdmin = false;
    let adminUserId = "";
    const authHeader = req.headers.get("Authorization");
    
    if (authHeader?.startsWith("Bearer ")) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      
      try {
        const userClient = createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: authHeader } },
        });
        const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(authHeader.replace("Bearer ", ""));
        
        if (!claimsError && claimsData?.claims?.sub) {
          adminUserId = claimsData.claims.sub as string;
          const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
          const adminClient = createClient(supabaseUrl, serviceRoleKey);
          const { data: roleData } = await adminClient
            .from("user_roles")
            .select("role")
            .eq("user_id", adminUserId)
            .eq("role", "admin")
            .maybeSingle();
          isAdmin = !!roleData;
        }
      } catch (e) {
        console.error("Auth check failed:", e);
      }
    }

    const cleanMessages = messages.filter((m: { content: string }) => m.content !== "AI service error");
    const systemPrompt = isAdmin ? ADMIN_PROMPT : VISITOR_PROMPT;

    if (isAdmin) {
      // Non-streaming admin mode with tool calling
      const adminSupabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const adminServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const adminSupabase = createClient(adminSupabaseUrl, adminServiceKey);

      let aiMessages = [
        { role: "system", content: systemPrompt },
        ...cleanMessages,
      ];

      // Loop for tool calls (max 5 iterations)
      for (let i = 0; i < 5; i++) {
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-5-mini",
            messages: aiMessages,
            tools: ADMIN_TOOLS,
            stream: false,
          }),
        });

        if (!response.ok) {
          const status = response.status;
          const t = await response.text();
          console.error("AI gateway error:", status, t);
          if (status === 429) {
            return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
          }
          if (status === 402) {
            return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
          }
          return new Response(JSON.stringify({ error: "AI service error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        const result = await response.json();
        const choice = result.choices?.[0];
        
        if (!choice) {
          return new Response(JSON.stringify({ error: "No response from AI" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        // If no tool calls, return the final response
        if (!choice.message?.tool_calls?.length) {
          return new Response(
            JSON.stringify({ content: choice.message?.content || "Done!", admin: true }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Process tool calls
        aiMessages.push(choice.message);
        
        for (const toolCall of choice.message.tool_calls) {
          const args = JSON.parse(toolCall.function.arguments);
          const toolResult = await executeTool(toolCall.function.name, args, adminSupabase, adminUserId);
          aiMessages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(toolResult),
          } as any);
        }
      }

      return new Response(
        JSON.stringify({ content: "I've completed the requested changes! ✨", admin: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Visitor mode: streaming
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5-mini",
        messages: [{ role: "system", content: systemPrompt }, ...cleanMessages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
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
