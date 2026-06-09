/**
 * POST /api/admin/send-bonus-alert
 * Sends a bonus alert broadcast to all subscribers via Resend.
 * Protected by ADMIN_SECRET env var.
 */
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { renderBonusAlertEmail } from "@/lib/email-renderer";

const resend = new Resend(process.env.RESEND_API_KEY);

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { exchange, bonus, affiliateUrl, otherBonuses = [] } = body;
  if (!exchange?.name || !bonus?.title || !affiliateUrl) {
    return NextResponse.json({ error: "Missing: exchange, bonus, affiliateUrl" }, { status: 400 });
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) return NextResponse.json({ error: "RESEND_AUDIENCE_ID not set" }, { status: 500 });

  try {
    const html = renderBonusAlertEmail({
      exchange, bonus, affiliateUrl,
      unsubscribeUrl: "{{{RESEND_UNSUBSCRIBE_URL}}}",
      otherBonuses,
    });

    const broadcast = await resend.broadcasts.create({
      audienceId,
      from: `Cryptoffiliate Alerts <alerts@${process.env.RESEND_FROM_DOMAIN ?? "cryptoffiliate.com"}>`,
      subject: `🎁 New ${exchange.name} bonus: ${bonus.title}`,
      html,
      name: `bonus-alert-${exchange.name.toLowerCase()}-${Date.now()}`,
    });

    if (broadcast.error) throw new Error(broadcast.error.message);
    const sendResult = await resend.broadcasts.send(broadcast.data!.id);
    if (sendResult.error) throw new Error(sendResult.error.message);

    return NextResponse.json({ ok: true, broadcastId: broadcast.data!.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
