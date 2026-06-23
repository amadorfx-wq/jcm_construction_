'use server';

// ─────────────────────────────────────────────────────────────────────────────
// JC Milian Construction — Server Action: submitLead
// Validación Zod + Honeypot + Email vía Resend + GHL Webhook
// ─────────────────────────────────────────────────────────────────────────────

import { Resend } from 'resend';
import { z } from 'zod';
import { leadFormSchema, inboundLeadSchema } from '@/lib/validations/leadSchema';
import type { SubmitLeadResult } from '@/types';

// ─── Env vars ─────────────────────────────────────────────────────────────────

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
}

// ─── Schema con honeypot ──────────────────────────────────────────────────────

const serverPayloadSchema = leadFormSchema.extend({
  website: z.string().default(''),
});

// ─── Labels para el email ─────────────────────────────────────────────────────

const projectLabels: Record<string, string> = {
  cocina: 'Kitchen Remodeling',
  bano:   'Bathroom Renovation',
  deck:   'Deck Construction',
  otro:   'Other project',
};

const financingLabels: Record<string, string> = {
  yes: 'Yes, interested in financing',
  no:  'No, paying directly',
};

// ─── Name splitter (handles Latino compound names) ────────────────────────────

function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  const spaceIndex = trimmed.indexOf(' ');
  if (spaceIndex === -1) {
    return { firstName: trimmed, lastName: '' };
  }
  return {
    firstName: trimmed.slice(0, spaceIndex),
    lastName: trimmed.slice(spaceIndex + 1),
  };
}

// ─── GHL Webhook (fire-and-forget, never blocks user) ─────────────────────────

async function sendToGHL(lead: z.output<typeof inboundLeadSchema>): Promise<void> {
  const webhookUrl = process.env.GHL_WEBHOOK_URL?.trim();

  if (!webhookUrl) {
    console.warn('[submitLead] GHL_WEBHOOK_URL not set — skipping GHL webhook.');
    return;
  }

  const { firstName, lastName } = splitName(lead.name);

  const ghlPayload = {
    first_name:      firstName,
    last_name:       lastName,
    full_name:       lead.name,
    phone:           lead.phone,
    email:           lead.email ?? '',
    project_type:    projectLabels[lead.projectType] ?? lead.projectType,
    wants_financing: lead.wantsFinancing,
    message:         `Project type: ${projectLabels[lead.projectType] ?? lead.projectType} | Financing: ${financingLabels[lead.wantsFinancing] ?? lead.wantsFinancing}`,
    source:          'Website - Free Estimate Form',
    consent_sms:             lead.consentSms === true,
    consent_sms_timestamp:   lead.consentSms === true ? lead.submittedAt : '',
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ghlPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
  } catch (error) {
    // GHL failure must NEVER affect the user experience.
    // Log and move on — the Resend email is the source of truth.
    console.error('[submitLead] GHL webhook error (non-blocking):', error);
  }
}

// ─── Email builder ────────────────────────────────────────────────────────────

function buildLeadEmailHtml(lead: z.output<typeof inboundLeadSchema>): string {
  const submittedTimestamp = new Date(lead.submittedAt).toLocaleString('en-US', { timeZone: 'America/New_York' });
  const didConsent = lead.consentSms === true;

  const consentHtml = didConsent
    ? `<span style="color:#16a34a;font-weight:600;">✓ YES — OK to text</span>
       <span style="color:#6b7280;font-size:12px;"> — ${submittedTimestamp} ET</span>`
    : `<span style="color:#dc2626;font-weight:600;">✗ NO — Call only</span>`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>New Lead — JC Milian</title>
</head>
<body style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111827;">

  <div style="border-left:3px solid #be123c;padding-left:16px;margin-bottom:24px;">
    <h1 style="margin:0;font-size:22px;font-weight:700;">New Lead — JC Milian Construction</h1>
    <p style="margin:4px 0 0;color:#6b7280;font-size:14px;">
      ID: ${lead.id} · ${submittedTimestamp} ET
    </p>
  </div>

  <div style="margin-bottom:20px;">
    <span style="background:#16a34a;color:#fff;padding:4px 12px;border-radius:4px;font-size:13px;font-weight:600;">
      ✓ FREE ESTIMATE REQUEST
    </span>
  </div>

  <table style="width:100%;border-collapse:collapse;font-size:15px;">
    <tr style="border-bottom:1px solid #e5e7eb;">
      <td style="padding:10px 0;color:#6b7280;width:40%;">Name</td>
      <td style="padding:10px 0;font-weight:600;">${lead.name}</td>
    </tr>
    <tr style="border-bottom:1px solid #e5e7eb;">
      <td style="padding:10px 0;color:#6b7280;">Phone</td>
      <td style="padding:10px 0;">
        <a href="tel:${lead.phone.replace(/[\s\(\)\-]/g, '')}" style="color:#be123c;font-weight:600;">
          ${lead.phone}
        </a>
      </td>
    </tr>
    <tr style="border-bottom:1px solid #e5e7eb;">
      <td style="padding:10px 0;color:#6b7280;">Email</td>
      <td style="padding:10px 0;">${lead.email || '—'}</td>
    </tr>
    <tr style="border-bottom:1px solid #e5e7eb;">
      <td style="padding:10px 0;color:#6b7280;">Project</td>
      <td style="padding:10px 0;">${projectLabels[lead.projectType] ?? lead.projectType}</td>
    </tr>
    <tr style="border-bottom:1px solid #e5e7eb;">
      <td style="padding:10px 0;color:#6b7280;">Financing</td>
      <td style="padding:10px 0;">${financingLabels[lead.wantsFinancing] ?? lead.wantsFinancing}</td>
    </tr>
    <tr>
      <td style="padding:10px 0;color:#6b7280;">SMS Consent</td>
      <td style="padding:10px 0;">
        ${consentHtml}
      </td>
    </tr>
  </table>

  <div style="margin-top:24px;padding:12px 16px;background:#f0fdf4;border:1px solid #86efac;border-radius:6px;font-size:13px;color:#166534;">
    Free estimate request. Contact within <strong>15 minutes</strong> for maximum conversion rate.
  </div>

  <p style="margin-top:32px;font-size:12px;color:#9ca3af;">
    JC Milian Construction · Atlanta, GA · Automated system
  </p>

</body>
</html>`;
}

// ─── Server Action ────────────────────────────────────────────────────────────

export async function submitLead(rawPayload: unknown): Promise<SubmitLeadResult> {
  // 0. Basic type guard (consent is optional — no longer blocks submission)
  if (typeof rawPayload !== 'object' || rawPayload === null) {
    return {
      success: false,
      message: 'Los datos del formulario no son válidos.',
    };
  }

  // 1. Validar payload con honeypot
  const parseResult = serverPayloadSchema.safeParse(rawPayload);
  if (!parseResult.success) {
    return {
      success: false,
      message: 'Los datos del formulario no son válidos. Por favor, revisa la información ingresada.',
    };
  }

  // 2. Honeypot check — respuesta silenciosa si fue completado
  const { website: honeypot, ...formData } = parseResult.data;
  if (honeypot.length > 0) {
    return { success: true, message: 'Tu solicitud ha sido enviada exitosamente.' };
  }

  // 3. Transformar con lógica server-only (id, submittedAt)
  const leadResult = inboundLeadSchema.safeParse(formData);
  if (!leadResult.success) {
    return { success: false, message: 'Error interno al procesar tu solicitud.' };
  }

  const lead = leadResult.data;

  // 4. Enviar email de notificación vía Resend
  //    This is the SOURCE OF TRUTH — user-facing success/failure depends ONLY on this.
  try {
    const resend    = new Resend(requireEnv('RESEND_API_KEY'));
    const adminEmail = requireEnv('ADMIN_EMAIL');
    const fromEmail  = requireEnv('FROM_EMAIL');

    await resend.emails.send({
      from:    fromEmail,
      to:      adminEmail,
      subject: `🔥 Free Estimate: ${lead.name} — ${projectLabels[lead.projectType] ?? lead.projectType}`,
      html:    buildLeadEmailHtml(lead),
    });
  } catch (error) {
    console.error('[submitLead] Resend error:', error);
    return {
      success: false,
      message: 'Hubo un problema al enviar tu solicitud. Por favor intenta nuevamente o llámanos directamente.',
    };
  }

  // 5. Send to GoHighLevel CRM — INDEPENDENT of Resend.
  //    Fire after Resend succeeds. Failure here is logged but NEVER shown to user.
  //    Do NOT await in a blocking way — use void to indicate fire-and-forget intent.
  sendToGHL(lead).catch((error) => {
    console.error('[submitLead] GHL post-send catch (non-blocking):', error);
  });

  return {
    success: true,
    message: 'Tu solicitud fue enviada. Un especialista te contactará en los próximos 15 minutos.',
    leadId: lead.id,
  };
}
