import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend';

interface BookingRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: string;
  budget?: string;
  message: string;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const booking: BookingRequest = await req.json();

    // Validate required fields
    if (!booking.name || !booking.email || !booking.projectType || !booking.message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(booking.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate field lengths
    if (booking.name.length > 100 || booking.email.length > 255 || booking.message.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Field length exceeded' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
      console.error('Email service secrets not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const name = escapeHtml(booking.name);
    const email = escapeHtml(booking.email);
    const phone = booking.phone ? escapeHtml(booking.phone) : null;
    const company = booking.company ? escapeHtml(booking.company) : null;
    const projectType = escapeHtml(booking.projectType);
    const budget = booking.budget ? escapeHtml(booking.budget) : null;
    const message = escapeHtml(booking.message).replace(/\n/g, '<br>');

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1e; color: #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0ea5e9, #2563eb); padding: 30px 24px;">
          <h1 style="margin: 0; color: white; font-size: 24px;">New Booking Request</h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">via jeweliq.tech</p>
        </div>
        <div style="padding: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; color: #94a3b8; font-size: 13px;">Name</td><td style="padding: 10px 0; color: #e2e8f0; font-weight: 600;">${name}</td></tr>
            <tr><td style="padding: 10px 0; color: #94a3b8; font-size: 13px;">Email</td><td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #0ea5e9;">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding: 10px 0; color: #94a3b8; font-size: 13px;">Phone</td><td style="padding: 10px 0; color: #e2e8f0;">${phone}</td></tr>` : ''}
            ${company ? `<tr><td style="padding: 10px 0; color: #94a3b8; font-size: 13px;">Company</td><td style="padding: 10px 0; color: #e2e8f0;">${company}</td></tr>` : ''}
            <tr><td style="padding: 10px 0; color: #94a3b8; font-size: 13px;">Services</td><td style="padding: 10px 0; color: #e2e8f0;">${projectType}</td></tr>
            ${budget ? `<tr><td style="padding: 10px 0; color: #94a3b8; font-size: 13px;">Budget</td><td style="padding: 10px 0; color: #e2e8f0;">${budget}</td></tr>` : ''}
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #111827; border-radius: 8px; border-left: 3px solid #0ea5e9;">
            <p style="margin: 0 0 8px; color: #94a3b8; font-size: 13px;">Project Details</p>
            <p style="margin: 0; color: #e2e8f0; line-height: 1.6;">${message}</p>
          </div>
        </div>
        <div style="padding: 16px 24px; background: #111827; text-align: center; font-size: 12px; color: #64748b;">
          JewelIQ Technologies &copy; ${new Date().getFullYear()} &bull; jeweliq.tech
        </div>
      </div>
    `;

    // 1. Always save the booking so no lead is ever lost
    let saved = false;
    try {
      const sbUrl = Deno.env.get('SUPABASE_URL')!;
      const sbKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const dbRes = await fetch(`${sbUrl}/rest/v1/chat_leads`, {
        method: 'POST',
        headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({
          name: booking.name, email: booking.email, phone: booking.phone ?? null,
          company: booking.company ?? null, source: 'booking_form', status: 'new',
          conversation_summary: `Services: ${booking.projectType}\n\n${booking.message}`,
        }),
      });
      saved = dbRes.ok;
      if (!dbRes.ok) console.error('DB save failed', dbRes.status, await dbRes.text());
    } catch (e) { console.error('DB save error', e); }

    // 2. Send email; fall back to Resend's test sender if domain isn't verified yet
    const send = (from: string) => fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': RESEND_API_KEY,
      },
      body: JSON.stringify({
        from,
        to: ['bookings@jeweliq.tech'],
        subject: `New Booking: ${projectType} - ${name}`,
        html: emailHtml,
        reply_to: booking.email,
      }),
    });

    let res = await send('JewelIQ Bookings <bookings@jeweliq.tech>');
    let data = await res.json();
    if (!res.ok && res.status === 403) {
      console.warn('Domain not verified, retrying with fallback sender');
      res = await send('JewelIQ Bookings <onboarding@resend.dev>');
      data = await res.json();
    }

    if (!res.ok) {
      console.error(`Resend gateway error [${res.status}]:`, JSON.stringify(data));
      if (!saved) {
        return new Response(
          JSON.stringify({ error: 'Failed to send email', status: res.status, details: data }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, saved, emailed: res.ok }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
