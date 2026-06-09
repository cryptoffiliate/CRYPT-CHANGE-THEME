/**
 * email-renderer.ts
 *
 * Lightweight HTML email renderer — zero external dependencies.
 * Replaces @react-email/render so the project installs cleanly
 * on any machine without special package access.
 *
 * Produces bulletproof HTML email compatible with Gmail, Apple Mail,
 * Outlook, and all major clients.
 */

export interface WelcomeEmailData {
  firstName?: string;
  preferences: string[];
  unsubscribeUrl: string;
}

export interface BonusAlertEmailData {
  firstName?: string;
  exchange: { name: string; logo: string; color: string };
  bonus: { title: string; description: string; expiresAt?: string; promoCode?: string };
  affiliateUrl: string;
  unsubscribeUrl: string;
  otherBonuses?: Array<{ name: string; bonus: string; url: string }>;
}

const PREF_LABELS: Record<string, string> = {
  all:     "All new bonuses",
  us_only: "US exchanges only",
  no_kyc:  "No-KYC exchanges",
  futures: "Futures & derivatives",
  staking: "Staking & yield",
};

function base(content: string, previewText: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Cryptoffiliate</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<!-- Preview text hack -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${previewText}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f8fafc;">
  <tr><td align="center" style="padding:40px 16px;">
    <table width="560" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;width:100%;">
      ${content}
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function card(content: string): string {
  return `<tr><td style="background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;padding:32px;margin-bottom:16px;">
    ${content}
  </td></tr>
  <tr><td style="height:12px;"></td></tr>`;
}

function footer(unsubscribeUrl: string): string {
  return `<tr><td style="padding:8px 0;text-align:center;">
    <p style="font-size:11px;color:#94a3b8;margin:0;line-height:1.6;">
      cryptoffiliate.com &middot; Affiliate disclosure: we earn commissions when you sign up via our links.<br>
      <a href="${unsubscribeUrl}" style="color:#94a3b8;">Unsubscribe</a> at any time.
    </p>
  </td></tr>`;
}

export function renderWelcomeEmail(data: WelcomeEmailData): string {
  const { firstName, preferences, unsubscribeUrl } = data;
  const greeting = firstName ? `Hey ${firstName}` : "Hey";

  const prefList = preferences
    .map(p => `<tr><td style="padding:3px 0;font-size:13px;color:#374151;">✓ ${PREF_LABELS[p] ?? p}</td></tr>`)
    .join("");

  const content = card(`
    <p style="font-size:18px;font-weight:700;color:#0f172a;margin:0 0 4px;">crypto<span style="color:#6366f1;">ffiliate</span></p>
    <h1 style="font-size:24px;font-weight:800;color:#0f172a;margin:16px 0 8px;">${greeting}, you're on the list 🎁</h1>
    <p style="font-size:14px;color:#64748b;line-height:1.6;margin:0 0 20px;">We'll email you the moment a new exchange bonus drops — verified, no spam, unsubscribe anytime.</p>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;">
    <p style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;margin:0 0 10px;">You're watching for</p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;">${prefList}</table>
    <table cellpadding="0" cellspacing="0" width="100%"><tr><td align="center">
      <a href="https://cryptoffiliate.com/bonuses" style="display:inline-block;background:#6366f1;color:#ffffff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:10px;text-decoration:none;">See current bonuses →</a>
    </td></tr></table>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;">
    <table cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:0 12px 0 0;width:33%;vertical-align:top;">
          <p style="font-size:13px;font-weight:600;color:#0f172a;margin:0 0 4px;">🔔 Instant alerts</p>
          <p style="font-size:11px;color:#94a3b8;margin:0;">Email within hours of a new offer</p>
        </td>
        <td style="padding:0 12px;width:33%;vertical-align:top;">
          <p style="font-size:13px;font-weight:600;color:#0f172a;margin:0 0 4px;">✅ Verified only</p>
          <p style="font-size:11px;color:#94a3b8;margin:0;">We test every bonus first</p>
        </td>
        <td style="padding:0 0 0 12px;width:33%;vertical-align:top;">
          <p style="font-size:13px;font-weight:600;color:#0f172a;margin:0 0 4px;">📉 No spam</p>
          <p style="font-size:11px;color:#94a3b8;margin:0;">1–3 emails/week max</p>
        </td>
      </tr>
    </table>
  `);

  return base(content + footer(unsubscribeUrl), `You're in — we'll alert you the moment a new crypto bonus drops 🎁`);
}

export function renderBonusAlertEmail(data: BonusAlertEmailData): string {
  const { firstName, exchange, bonus, affiliateUrl, unsubscribeUrl, otherBonuses = [] } = data;
  const greeting = firstName ? `Hey ${firstName}` : "Hey";

  const otherBonusesHtml = otherBonuses.length > 0 ? card(`
    <p style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;margin:0 0 12px;">Other active bonuses</p>
    <table cellpadding="0" cellspacing="0" width="100%">
      ${otherBonuses.map(b => `
        <tr>
          <td style="padding:6px 0;border-bottom:1px solid #f1f5f9;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="font-size:13px;font-weight:600;color:#0f172a;">${b.name}</td>
              <td style="font-size:13px;color:#16a34a;text-align:center;">${b.bonus}</td>
              <td style="text-align:right;"><a href="${b.url}" style="font-size:12px;color:#6366f1;text-decoration:none;">Claim →</a></td>
            </tr></table>
          </td>
        </tr>`).join("")}
    </table>
  `) : "";

  const expiryBadge = bonus.expiresAt
    ? `<p style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:8px 12px;font-size:12px;color:#92400e;font-weight:600;margin:0 0 16px;">⏰ Limited time — expires ${bonus.expiresAt}</p>`
    : "";

  const promoCode = bonus.promoCode
    ? `<p style="font-size:12px;color:#166534;margin:8px 0 0;">Promo code: <span style="font-family:monospace;background:#d1fae5;padding:2px 6px;border-radius:4px;font-weight:700;">${bonus.promoCode}</span></p>`
    : "";

  const content = card(`
    <table cellpadding="0" cellspacing="0" width="100%"><tr>
      <td><p style="font-size:14px;font-weight:700;color:#0f172a;margin:0;">crypto<span style="color:#6366f1;">ffiliate</span> <span style="font-size:12px;color:#94a3b8;font-weight:400;">&middot; Bonus alert</span></p></td>
    </tr></table>
    <div style="display:inline-block;background:${exchange.color}18;border:1px solid ${exchange.color}30;border-radius:99px;padding:4px 12px;margin:12px 0;">
      <span style="font-size:11px;font-weight:700;color:${exchange.color};">${exchange.logo} ${exchange.name}</span>
    </div>
    ${expiryBadge}
    <h1 style="font-size:22px;font-weight:800;color:#0f172a;margin:8px 0 8px;line-height:1.3;">${greeting} — ${exchange.name} just dropped a new bonus</h1>
    <p style="font-size:14px;color:#64748b;line-height:1.6;margin:0 0 16px;">${bonus.description}</p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin-bottom:20px;">
      <p style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#16a34a;margin:0 0 4px;">Your offer</p>
      <p style="font-size:20px;font-weight:800;color:#166534;margin:0;">🎁 ${bonus.title}</p>
      ${promoCode}
    </div>
    <table cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" style="padding-bottom:8px;">
      <a href="${affiliateUrl}" style="display:inline-block;background:${exchange.color};color:#ffffff;font-size:14px;font-weight:700;padding:13px 28px;border-radius:10px;text-decoration:none;">Claim ${exchange.name} bonus →</a>
    </td></tr></table>
    <p style="font-size:11px;color:#94a3b8;text-align:center;margin:0;">Affiliate link &middot; we earn a small commission at no cost to you</p>
  `) + otherBonusesHtml;

  return base(
    content + footer(unsubscribeUrl),
    `🎁 New bonus: ${exchange.name} is offering ${bonus.title}`
  );
}
