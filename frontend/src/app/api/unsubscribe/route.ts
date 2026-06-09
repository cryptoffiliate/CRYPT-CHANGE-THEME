/**
 * GET  /api/unsubscribe?email=... — one-click unsubscribe (List-Unsubscribe header)
 * POST /api/unsubscribe           — programmatic unsubscribe from form
 *
 * Handles Gmail/Apple Mail one-click unsubscribe and the manual unsubscribe page.
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function unsubscribeEmail(email: string): Promise<{ ok: boolean; error?: string }> {
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) return { ok: false, error: "Not configured" };

  // Find the contact in Resend
  const contacts = await resend.contacts.list({ audienceId });
  if (contacts.error) return { ok: false, error: contacts.error.message };

  const contact = (contacts.data?.data ?? []).find(
    (c: any) => c.email === email
  );

  if (!contact) {
    // Not found — treat as success (idempotent)
    return { ok: true };
  }

  // Mark as unsubscribed
  const result = await resend.contacts.update({
    id: contact.id,
    audienceId,
    unsubscribed: true,
  });

  if (result.error) return { ok: false, error: result.error.message };

  // Also update Supabase
  try {
    const { createServerSupabaseClient } = await import("@/lib/supabase");
    const supabase = createServerSupabaseClient();
    await supabase
      .from("email_subscribers")
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq("email", email);
  } catch {
    // Non-blocking
  }

  return { ok: true };
}

// One-click unsubscribe (triggered by email client via List-Unsubscribe header)
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const result = await unsubscribeEmail(decodeURIComponent(email));

  // Redirect to a confirmation page
  const url = new URL("/unsubscribed", req.url);
  url.searchParams.set("status", result.ok ? "success" : "error");
  return NextResponse.redirect(url);
}

// Programmatic POST (from the unsubscribe page form)
export async function POST(req: NextRequest) {
  let email: string;
  try {
    const body = await req.json();
    email = body.email;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ ok: false, error: "Email required" }, { status: 400 });
  }

  const result = await unsubscribeEmail(email);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
