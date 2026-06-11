import "server-only";
import { APP_URL, DISCLAIMER } from "@/lib/utils";

/**
 * Email templates. Each template returns subject + html + text.
 *
 * Categories drive preference checks and unsubscribe links:
 * - transactional: always sent (account/security/billing/receipts)
 * - product: workflow results + educational nurture content
 * - marketing: upgrade nudges
 * - usage: quota warnings
 * - deadline: RFP deadline reminders
 * - opportunity: saved-search alerts
 */

export type EmailCategory =
  | "transactional"
  | "product"
  | "marketing"
  | "usage"
  | "deadline"
  | "opportunity";

export type TemplatePayload = Record<string, string>;

export type RenderedEmail = { subject: string; html: string; text: string };

type TemplateDef = {
  category: EmailCategory;
  render: (p: TemplatePayload) => { subject: string; heading: string; bodyHtml: string; bodyText: string; ctaLabel?: string; ctaUrl?: string };
};

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layout(args: {
  heading: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
  unsubscribeUrl?: string;
}): string {
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f1f4f8;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #dde4ee;">
<tr><td style="background:#1a3357;padding:18px 28px;">
  <span style="color:#ffffff;font-size:18px;font-weight:bold;">GovBidWriter</span>
</td></tr>
<tr><td style="padding:28px;">
  <h1 style="margin:0 0 14px;font-size:20px;color:#1a3357;">${esc(args.heading)}</h1>
  <div style="font-size:14px;line-height:1.6;color:#33405a;">${args.bodyHtml}</div>
  ${
    args.ctaLabel && args.ctaUrl
      ? `<div style="margin-top:22px;"><a href="${args.ctaUrl}" style="display:inline-block;background:#1f9188;color:#ffffff;text-decoration:none;padding:11px 22px;border-radius:6px;font-size:14px;font-weight:bold;">${esc(args.ctaLabel)}</a></div>`
      : ""
  }
</td></tr>
<tr><td style="padding:18px 28px;border-top:1px solid #e7ecf3;">
  <p style="margin:0;font-size:11px;color:#8593ab;line-height:1.5;">${esc(DISCLAIMER)}</p>
  ${
    args.unsubscribeUrl
      ? `<p style="margin:8px 0 0;font-size:11px;color:#8593ab;">Don't want these emails? <a href="${args.unsubscribeUrl}" style="color:#8593ab;">Unsubscribe</a> or manage preferences in your <a href="${APP_URL}/dashboard/settings" style="color:#8593ab;">settings</a>.</p>`
      : ""
  }
</td></tr>
</table></td></tr></table>
</body></html>`;
}

export const EMAIL_TEMPLATES: Record<string, TemplateDef> = {
  welcome: {
    category: "transactional",
    render: (p) => ({
      subject: "Welcome to GovBidWriter — here's your first step",
      heading: `Welcome${p.name ? `, ${p.name}` : ""}!`,
      bodyHtml: `<p>You now have an account on GovBidWriter — AI-assisted RFP analysis, compliance matrices, and proposal drafts for government contractors.</p>
<p><strong>The single best first step:</strong> fill in your company profile. Every capability statement and proposal section is grounded in it, so 5 minutes there pays off in every generation.</p>
<p>Your Free plan includes 3 AI generations and 1 RFP upload per month.</p>`,
      bodyText: `Welcome to GovBidWriter!\n\nThe single best first step: fill in your company profile — every capability statement and proposal section is grounded in it.\n\nYour Free plan includes 3 AI generations and 1 RFP upload per month.\n\nStart here: ${APP_URL}/dashboard/company-profile`,
      ctaLabel: "Complete your company profile",
      ctaUrl: `${APP_URL}/dashboard/company-profile`,
    }),
  },

  nurture_compliance: {
    category: "product",
    render: () => ({
      subject: "Why most first government bids lose (and the 30-minute fix)",
      heading: "Compliance beats eloquence",
      bodyHtml: `<p>Most first-time government proposals don't lose on quality — they lose on compliance. A missed form, an unacknowledged amendment, an unanswered "shall" on page 47.</p>
<p>The fix is the <strong>compliance matrix</strong>: one row per requirement, tracked to completion. Evaluators check compliance before they score anything, so this is where bids are won or lost.</p>
<p>Upload your next RFP and GovBidWriter builds the draft matrix for you in about a minute.</p>`,
      bodyText: `Most first-time government proposals lose on compliance, not quality.\n\nThe fix is the compliance matrix: one row per requirement, tracked to completion.\n\nUpload your next RFP and GovBidWriter builds the draft matrix in about a minute: ${APP_URL}/dashboard/rfps/new`,
      ctaLabel: "Analyze an RFP",
      ctaUrl: `${APP_URL}/dashboard/rfps/new`,
    }),
  },

  nurture_upgrade: {
    category: "marketing",
    render: () => ({
      subject: "Draft the full proposal, not just the outline",
      heading: "When you're ready to respond for real",
      bodyHtml: `<p>The Free plan shows you the workflow. <strong>Pro</strong> is for responding to actual solicitations:</p>
<ul><li>100 AI generations / 20 RFP uploads per month</li>
<li>The full compliance matrix (not a 5-row preview) with CSV export</li>
<li>All 11 proposal sections drafted, with Markdown export</li></ul>
<p>$79/month, cancel anytime. One won contract pays for years of it.</p>`,
      bodyText: `Pro is for responding to actual solicitations: 100 generations and 20 uploads per month, the full compliance matrix with CSV export, and all 11 proposal sections with Markdown export.\n\n$79/month, cancel anytime: ${APP_URL}/dashboard/billing`,
      ctaLabel: "See Pro",
      ctaUrl: `${APP_URL}/dashboard/billing`,
    }),
  },

  capability_statement_ready: {
    category: "product",
    render: (p) => ({
      subject: "Your capability statement is ready",
      heading: "Capability statement generated",
      bodyHtml: `<p>Your capability statement${p.targetIndustry ? ` for <strong>${esc(p.targetIndustry)}</strong>` : ""} was generated and is ready to copy from your dashboard.</p>
<p>Tip: regenerate it per target agency — leading with the most relevant competencies measurably improves response rates from contracting officers.</p>`,
      bodyText: `Your capability statement was generated and is ready in your dashboard: ${APP_URL}/dashboard/company-profile`,
      ctaLabel: "View it",
      ctaUrl: `${APP_URL}/dashboard/company-profile`,
    }),
  },

  rfp_uploaded: {
    category: "product",
    render: (p) => ({
      subject: `RFP received: ${p.rfpTitle || "your document"}`,
      heading: "RFP uploaded successfully",
      bodyHtml: `<p><strong>${esc(p.rfpTitle || "Your RFP")}</strong> was uploaded and its text extracted (${esc(p.chars || "0")} characters).</p>
<p>Next: run the analysis to pull out the deadline, evaluation criteria, and submission instructions — then extract the compliance matrix.</p>`,
      bodyText: `${p.rfpTitle || "Your RFP"} was uploaded and its text extracted.\n\nNext: run the analysis, then extract the compliance matrix: ${APP_URL}/dashboard/rfps/${p.rfpId || ""}`,
      ctaLabel: "Analyze this RFP",
      ctaUrl: `${APP_URL}/dashboard/rfps/${p.rfpId || ""}`,
    }),
  },

  rfp_analysis_complete: {
    category: "product",
    render: (p) => ({
      subject: `Analysis ready: ${p.rfpTitle || "your RFP"}`,
      heading: "RFP analysis complete",
      bodyHtml: `<p>The analysis of <strong>${esc(p.rfpTitle || "your RFP")}</strong> is ready.</p>
${p.deadline ? `<p><strong>Deadline found:</strong> ${esc(p.deadline)} — work backward from it and leave 48 hours for production and submission.</p>` : ""}
<p>Next step: extract the requirements into your compliance matrix.</p>`,
      bodyText: `The analysis of ${p.rfpTitle || "your RFP"} is ready.${p.deadline ? ` Deadline found: ${p.deadline}.` : ""}\n\nView it: ${APP_URL}/dashboard/rfps/${p.rfpId || ""}`,
      ctaLabel: "View the analysis",
      ctaUrl: `${APP_URL}/dashboard/rfps/${p.rfpId || ""}`,
    }),
  },

  compliance_matrix_ready: {
    category: "product",
    render: (p) => ({
      subject: `Compliance matrix ready: ${p.count || ""} requirements found`,
      heading: "Your compliance matrix is ready",
      bodyHtml: `<p><strong>${esc(p.count || "Several")} requirements</strong> were extracted from <strong>${esc(p.rfpTitle || "your RFP")}</strong>, each with section, priority, and risk level.</p>
<p>Work the high-priority rows first — those are the ones that can make a proposal unawardable. Verify every row against the official solicitation.</p>`,
      bodyText: `${p.count || "Several"} requirements were extracted from ${p.rfpTitle || "your RFP"}.\n\nReview the matrix: ${APP_URL}/dashboard/rfps/${p.rfpId || ""}`,
      ctaLabel: "Open the matrix",
      ctaUrl: `${APP_URL}/dashboard/rfps/${p.rfpId || ""}`,
    }),
  },

  proposal_draft_ready: {
    category: "product",
    render: (p) => ({
      subject: `Proposal draft started: ${p.proposalTitle || "your proposal"}`,
      heading: "Your proposal draft is underway",
      bodyHtml: `<p>The first drafted section of <strong>${esc(p.proposalTitle || "your proposal")}</strong> is ready to review and edit.</p>
<p>Generate the remaining sections one by one, edit them in place, and export the whole proposal to Markdown when you're done.</p>`,
      bodyText: `The first drafted section of ${p.proposalTitle || "your proposal"} is ready.\n\nKeep going: ${APP_URL}/dashboard/proposals/${p.proposalId || ""}`,
      ctaLabel: "Open the editor",
      ctaUrl: `${APP_URL}/dashboard/proposals/${p.proposalId || ""}`,
    }),
  },

  usage_limit_warning: {
    category: "usage",
    render: (p) => ({
      subject: "Heads up: you're close to your monthly limit",
      heading: "Almost at your monthly limit",
      bodyHtml: `<p>You've used <strong>${esc(p.used || "?")} of ${esc(p.limit || "?")}</strong> AI generations on the ${esc(p.plan || "Free")} plan this month.</p>
<p>Your limit resets on the 1st. If you're mid-bid, Pro removes the squeeze with 100 generations per month.</p>`,
      bodyText: `You've used ${p.used} of ${p.limit} AI generations this month on the ${p.plan} plan. Resets on the 1st.\n\nUpgrade: ${APP_URL}/dashboard/billing`,
      ctaLabel: "View usage & plans",
      ctaUrl: `${APP_URL}/dashboard/billing`,
    }),
  },

  usage_limit_reached: {
    category: "usage",
    render: (p) => ({
      subject: "You've reached your monthly AI generation limit",
      heading: "Monthly limit reached",
      bodyHtml: `<p>You've used all <strong>${esc(p.limit || "")}</strong> AI generations on the ${esc(p.plan || "Free")} plan for this month. Your work is saved and editing remains unlimited.</p>
<p>Limits reset on the 1st — or upgrade to Pro to keep generating now.</p>`,
      bodyText: `You've used all ${p.limit} AI generations for this month on the ${p.plan} plan. Editing remains unlimited; limits reset on the 1st.\n\nUpgrade: ${APP_URL}/dashboard/billing`,
      ctaLabel: "Upgrade to Pro",
      ctaUrl: `${APP_URL}/dashboard/billing`,
    }),
  },

  subscription_upgraded: {
    category: "transactional",
    render: () => ({
      subject: "You're on GovBidWriter Pro",
      heading: "Welcome to Pro",
      bodyHtml: `<p>Your account is now on the <strong>Pro</strong> plan: 100 AI generations and 20 RFP uploads per month, full compliance matrices, all 11 proposal sections, and Markdown/CSV export.</p>
<p>Manage your subscription anytime from the billing page.</p>`,
      bodyText: `Your account is now on the Pro plan: 100 generations and 20 uploads per month, full matrices, full proposals, and exports.\n\nBilling: ${APP_URL}/dashboard/billing`,
      ctaLabel: "Go to your dashboard",
      ctaUrl: `${APP_URL}/dashboard`,
    }),
  },

  subscription_canceled: {
    category: "transactional",
    render: () => ({
      subject: "Your Pro subscription was canceled",
      heading: "Subscription canceled",
      bodyHtml: `<p>Your Pro subscription has been canceled and your account is back on the Free plan. All of your RFPs, matrices, and proposals remain saved and editable.</p>
<p>You can re-upgrade anytime from the billing page.</p>`,
      bodyText: `Your Pro subscription was canceled; your account is back on the Free plan. All your work remains saved.\n\nBilling: ${APP_URL}/dashboard/billing`,
      ctaLabel: "Billing",
      ctaUrl: `${APP_URL}/dashboard/billing`,
    }),
  },

  deadline_reminder: {
    category: "deadline",
    render: (p) => ({
      subject: `Deadline approaching: ${p.rfpTitle || "RFP"} (${p.deadline || "soon"})`,
      heading: "RFP deadline approaching",
      bodyHtml: `<p><strong>${esc(p.rfpTitle || "Your RFP")}</strong> is due <strong>${esc(p.deadline || "soon")}</strong>.</p>
<p>Pre-submission check: every compliance-matrix row resolved, all amendments acknowledged, formatting verified against Section L — and submit early enough to confirm receipt.</p>`,
      bodyText: `${p.rfpTitle || "Your RFP"} is due ${p.deadline || "soon"}.\n\nRun your final compliance check: ${APP_URL}/dashboard/rfps/${p.rfpId || ""}`,
      ctaLabel: "Final compliance check",
      ctaUrl: `${APP_URL}/dashboard/rfps/${p.rfpId || ""}`,
    }),
  },

  saved_search_alert: {
    category: "opportunity",
    render: (p) => ({
      subject: `New opportunities matching "${p.searchName || "your saved search"}"`,
      heading: "New matching opportunities",
      bodyHtml: `<p>There are new opportunities matching your saved search <strong>${esc(p.searchName || "")}</strong>.</p>
<p>Review them and pull any worth bidding into GovBidWriter for analysis.</p>`,
      bodyText: `New opportunities match your saved search ${p.searchName || ""}.\n\n${APP_URL}/dashboard`,
      ctaLabel: "View",
      ctaUrl: `${APP_URL}/dashboard`,
    }),
  },

  admin_new_signup: {
    category: "transactional",
    render: (p) => ({
      subject: `New GovBidWriter signup: ${p.email || ""}`,
      heading: "New user signed up",
      bodyHtml: `<p><strong>${esc(p.email || "")}</strong>${p.name ? ` (${esc(p.name)})` : ""} just created an account.</p>`,
      bodyText: `New signup: ${p.email || ""}${p.name ? ` (${p.name})` : ""}`,
    }),
  },
};

export type TemplateKey = keyof typeof EMAIL_TEMPLATES;

export function renderTemplate(
  key: string,
  payload: TemplatePayload,
  unsubscribeUrl?: string
): RenderedEmail | null {
  const def = EMAIL_TEMPLATES[key];
  if (!def) return null;
  const r = def.render(payload);
  return {
    subject: r.subject,
    html: layout({
      heading: r.heading,
      bodyHtml: r.bodyHtml,
      ctaLabel: r.ctaLabel,
      ctaUrl: r.ctaUrl,
      unsubscribeUrl,
    }),
    text: `${r.bodyText}\n\n—\n${DISCLAIMER}${unsubscribeUrl ? `\nUnsubscribe: ${unsubscribeUrl}` : ""}`,
  };
}

export function templateCategory(key: string): EmailCategory | null {
  return EMAIL_TEMPLATES[key]?.category ?? null;
}
