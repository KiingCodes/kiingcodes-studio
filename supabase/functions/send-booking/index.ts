import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BookingRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: string;
  budget?: string;
  message: string;
}

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

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    
    if (!RESEND_API_KEY) {
      // Fallback: Use Supabase's built-in SMTP via the admin API
      // For now, we'll use Resend as primary email provider
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const projectTypeMap: Record<string, string> = {
      website: 'Website Development',
      webapp: 'Web Application',
      mobile: 'Mobile App',
      ecommerce: 'E-Commerce',
      consulting: 'Consulting',
      other: 'Other',
    };

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1e; color: #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0ea5e9, #8b5cf6); padding: 30px 24px;">
          <h1 style="margin: 0; color: white; font-size: 24px;">🚀 New Booking Request</h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">via jeweliq.tech</p>
        </div>
        <div style="padding: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; color: #94a3b8; font-size: 13px;">Name</td><td style="padding: 10px 0; color: #e2e8f0; font-weight: 600;">${booking.name}</td></tr>
            <tr><td style="padding: 10px 0; color: #94a3b8; font-size: 13px;">Email</td><td style="padding: 10px 0;"><a href="mailto:${booking.email}" style="color: #0ea5e9;">${booking.email}</a></td></tr>
            ${booking.phone ? `<tr><td style="padding: 10px 0; color: #94a3b8; font-size: 13px;">Phone</td><td style="padding: 10px 0; color: #e2e8f0;">${booking.phone}</td></tr>` : ''}
            ${booking.company ? `<tr><td style="padding: 10px 0; color: #94a3b8; font-size: 13px;">Company</td><td style="padding: 10px 0; color: #e2e8f0;">${booking.company}</td></tr>` : ''}
            <tr><td style="padding: 10px 0; color: #94a3b8; font-size: 13px;">Project Type</td><td style="padding: 10px 0; color: #e2e8f0;">${projectTypeMap[booking.projectType] || booking.projectType}</td></tr>
            ${booking.budget ? `<tr><td style="padding: 10px 0; color: #94a3b8; font-size: 13px;">Budget</td><td style="padding: 10px 0; color: #e2e8f0;">${booking.budget}</td></tr>` : ''}
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #111827; border-radius: 8px; border-left: 3px solid #0ea5e9;">
            <p style="margin: 0 0 8px; color: #94a3b8; font-size: 13px;">Project Details</p>
            <p style="margin: 0; color: #e2e8f0; line-height: 1.6;">${booking.message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
        <div style="padding: 16px 24px; background: #111827; text-align: center; font-size: 12px; color: #64748b;">
          JewelIQ © ${new Date().getFullYear()} • jeweliq.tech
        </div>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'JewelIQ Bookings <onboarding@resend.dev>',
        to: ['kiingncube@gmail.com'],
        subject: `New Booking: ${projectTypeMap[booking.projectType] || booking.projectType} - ${booking.name}`,
        html: emailHtml,
        reply_to: booking.email,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Resend error:', data);
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
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
