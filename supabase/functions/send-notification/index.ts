import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const { type, to, subject, html, data } = await req.json();

    let emailSubject = subject;
    let emailHtml = html;

    // Build email content based on notification type
    if (type === "service_request") {
      emailSubject = `New Service Request: ${data.title}`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">New Service Request Submitted</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Title:</strong> ${data.title}</p>
            <p><strong>Service Type:</strong> ${data.service_type}</p>
            <p><strong>Description:</strong> ${data.description}</p>
            ${data.budget_range ? `<p><strong>Budget:</strong> ${data.budget_range}</p>` : ""}
            ${data.urgency ? `<p><strong>Urgency:</strong> ${data.urgency}</p>` : ""}
            <p><strong>Client:</strong> ${data.company_name}</p>
          </div>
          <p style="color: #64748b; font-size: 14px;">This is an automated notification from JewelIQ Client Portal.</p>
        </div>
      `;
    } else if (type === "new_message") {
      emailSubject = `New Message from ${data.sender_name || "Client"}`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">New Portal Message</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 16px 0;">
            <p><strong>From:</strong> ${data.sender_name || "Client"}</p>
            <p><strong>Company:</strong> ${data.company_name}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${data.message}</p>
          </div>
          <p style="color: #64748b; font-size: 14px;">This is an automated notification from JewelIQ Client Portal.</p>
        </div>
      `;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "JewelIQ Portal <notifications@jeweliq.co.za>",
        to: Array.isArray(to) ? to : [to],
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Email notification error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
