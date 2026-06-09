/**
 * POST /api/subscribe
 * Subscribes an email to the bonus alerts list via Resend Audiences.
 */
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { renderWelcomeEmail } from "@/lib/email-renderer";

const resend = new Resend(process.env.RESEND_API_KEY);

function isValidEmail(email: string): boolean {
  return email.includes("@") && email.includes(".") && email.length <= 254;
}

const rateLimitMap = new Map<string, number>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const last = rateLimitMap.get(ip) ?? 0;
  if (now - last < 60_000) return true;
  rateLimitMap.set(ip, now);
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please wait a minute." }, { status: 429 });
  }

  let body: { email?: string; firstName?: string; preferences?: string[] };
  try { body = await req.json(); }
  catch { return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 }); }

  const { email, firstName, preferences = ["all"] } = body;
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) {
    console.error("[subscribe] RESEND_AUDIENCE_ID not set");
    return NextResponse.json({ ok: false, error: "Email service not configured." }, { status: 500 });
  }

  try {
    // Add to Resend Audience
    const contactResult = await resend.contacts.create({
      email, firstName: firstName?.trim() || undefined,
      unsubscribed: false, audienceId,
    });
    if (contactResult.error && (contactResult.error as any)?.statusCode !== 422) {
      throw new Error(contactResult.error.message);
    }

    // Send welcome email using our zero-dep renderer
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
    const html = renderWelcomeEmail({ firstName, preferences, unsubscribeUrl });

    await resend.emails.send({
      from: `Cryptoffiliate <alerts@${process.env.RESEND_FROM_DOMAIN ?? "cryptoffiliate.com"}>`,
      to: email,
      subject: "You're in — bonus alerts are live 🎁",
      html,
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });

    // Log to Supabase (non-blocking)
    logToSupabase(email, firstName, preferences, ip).catch(console.error);

    return NextResponse.json({ ok: true, message: "You're subscribed! Check your inbox." });
  } catch (err) {
    console.error("[subscribe] Error:", err);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

async function logToSupabase(email: string, firstName: string | undefined, preferences: string[], ip: string) {
  const { createServerSupabaseClient } = await import("@/lib/supabase");
  const supabase = createServerSupabaseClient();
  let hash = 0;
  for (let i = 0; i < ip.length; i++) { hash = ((hash << 5) - hash) + ip.charCodeAt(i); hash |= 0; }
  await supabase.from("email_subscribers").upsert(
    { email, first_name: firstName ?? null, preferences, subscribed_at: new Date().toISOString(), ip_hash: Math.abs(hash).toString(16) },
    { onConflict: "email" }
  );
}

export const runtime = "nodejs";
