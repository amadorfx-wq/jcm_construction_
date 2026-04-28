'use server';

// ─────────────────────────────────────────────────────────────────────────────
// JC Milian Construction — Server Action: submitLead
// Validación Zod + Honeypot + Email vía Resend + BudgetGate server-only
// ─────────────────────────────────────────────────────────────────────────────

import { Resend } from 'resend';
import { z } from 'zod';
import { leadFormSchema, inboundLeadSchema } from '@/lib/validations/leadSchema';
import type { SubmitLeadResult } from '@/types';

// ─── Env vars (validados en runtime, no en build) ─────────────────────────────

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
}

// ─── Schema con honeypot ──────────────────────────────────────────────────────

const serverPayloadSchema = leadFormSchema.extend({
  // Campo honeypot: visible para bots, oculto via CSS para humanos.
  // Nombre "website" parece legítimo para bots.
  website: z.string().default(''),
});

// ─── Email builder ────────────────────────────────────────────────────────────

function buildLeadEmailHtml(lead: z.output<typeof inboundLeadSchema>): string {
  const qualificationBadge = lead.isQualified
    ? `<span style="background:#16a34a;color:#fff;padding:4px 12px;border-radius:4px;font-size:13px;font-weight:600;">✓ LEAD CALIFICADO</span>`
    : `<span style="background:#dc2626;color:#fff;padding:4px 12px;border-radius:4px;font-size:13px;font-weight:600;">✗ DESCALIFICADO — Automation</span>`;

  const budgetLabels: Record<string, string> = {
    under_15k: 'Menos de $15,000',
    '15k_30k': '$15,000 – $30,000',
    '30k_60k': '$30,000 – $60,000',
    '60k_100k': '$60,000 – $100,000',
    over_100k: 'Más de $100,000',
  };

  const projectLabels: Record<string, string> = {
    cocina: 'Remodelación de Cocina',
    bano: 'Remodelación de Baño',
    deck: 'Construcción de Deck',
    otro: 'Otro proyecto',
  };

  const financingLabels: Record<string, string> = {
    yes: 'Sí, busca financiamiento',
    no: 'No, pago directo',
    maybe: 'Quizás, pendiente evaluar',
  };

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Nuevo Lead — JC Milian</title>
</head>
<body style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111827;">
  <div style="border-left:3px solid #be123c;padding-left:16px;margin-bottom:24px;">
    <h1 style="margin:0;font-size:22px;font-weight:700;">Nuevo Lead — JC Milian Construction</h1>
    <p style="margin:4px 0 0;color:#6b7280;font-size:14px;">ID: ${lead.id} · ${new Date(lead.submittedAt).toLocaleString('es-US', { timeZone: 'America/New_York' })} ET</p>
  </div>

  <div style="margin-bottom:20px;">${qualificationBadge}</div>

  <table style="width:100%;border-collapse:collapse;font-size:15px;">
    <tr style="border-bottom:1px solid #e5e7eb;">
      <td style="padding:10px 0;color:#6b7280;width:40%;">Nombre</td>
      <td style="padding:10px 0;font-weight:600;">${lead.contact.name}</td>
    </tr>
    <tr style="border-bottom:1px solid #e5e7eb;">
      <td style="padding:10px 0;color:#6b7280;">Email</td>
      <td style="padding:10px 0;"><a href="mailto:${lead.contact.email}" style="color:#be123c;">${lead.contact.email}</a></td>
    </tr>
    <tr style="border-bottom:1px solid #e5e7eb;">
      <td style="padding:10px 0;color:#6b7280;">Teléfono</td>
      <td style="padding:10px 0;"><a href="tel:${lead.contact.phone}" style="color:#be123c;">${lead.contact.phone}</a></td>
    </tr>
    <tr style="border-bottom:1px solid #e5e7eb;">
      <td style="padding:10px 0;color:#6b7280;">Ciudad</td>
      <td style="padding:10px 0;">${lead.contact.city}</td>
    </tr>
    <tr style="border-bottom:1px solid #e5e7eb;">
      <td style="padding:10px 0;color:#6b7280;">Proyecto</td>
      <td style="padding:10px 0;">${projectLabels[lead.projectType] ?? lead.projectType}</td>
    </tr>
    <tr style="border-bottom:1px solid #e5e7eb;">
      <td style="padding:10px 0;color:#6b7280;">Presupuesto</td>
      <td style="padding:10px 0;">${budgetLabels[lead.budgetRange] ?? lead.budgetRange}</td>
    </tr>
    <tr>
      <td style="padding:10px 0;color:#6b7280;">Financiamiento</td>
      <td style="padding:10px 0;">${financingLabels[lead.financingIntent] ?? lead.financingIntent}</td>
    </tr>
  </table>

  ${
    lead.derivedToAutomation
      ? `<div style="margin-top:24px;padding:12px 16px;background:#fef2f2;border:1px solid #fca5a5;border-radius:6px;font-size:13px;color:#991b1b;">
          Este lead ha sido derivado al flujo de automatización (presupuesto descalificado). No requiere seguimiento manual.
        </div>`
      : `<div style="margin-top:24px;padding:12px 16px;background:#f0fdf4;border:1px solid #86efac;border-radius:6px;font-size:13px;color:#166534;">
          Lead calificado. Contactar en las próximas 24 horas para máxima tasa de cierre.
        </div>`
  }

  <p style="margin-top:32px;font-size:12px;color:#9ca3af;">JC Milian Construction · Atlanta, GA · Sistema automatizado</p>
</body>
</html>`;
}

// ─── Server Action ────────────────────────────────────────────────────────────

export async function submitLead(rawPayload: unknown): Promise<SubmitLeadResult> {
  // 1. Validar payload contra schema con honeypot
  const parseResult = serverPayloadSchema.safeParse(rawPayload);
  if (!parseResult.success) {
    return {
      success: false,
      message: 'Los datos del formulario no son válidos. Por favor, revisa la información ingresada.',
    };
  }

  // 2. Extraer honeypot — respuesta silenciosa si fue completado (es un bot)
  const { website: honeypot, ...formData } = parseResult.data;
  if (honeypot.length > 0) {
    // Respuesta idéntica al éxito real — nunca revelar la detección
    return { success: true, message: 'Tu solicitud ha sido enviada exitosamente.' };
  }

  // 3. Transformar con lógica server-only (isQualified, derivedToAutomation, id)
  const leadResult = inboundLeadSchema.safeParse(formData);
  if (!leadResult.success) {
    return { success: false, message: 'Error interno al procesar tu solicitud.' };
  }

  const lead = leadResult.data;

  // 4. Enviar email de notificación vía Resend
  try {
    const resend = new Resend(requireEnv('RESEND_API_KEY'));
    const adminEmail = requireEnv('ADMIN_EMAIL');
    const fromEmail = requireEnv('FROM_EMAIL');

    const subject = lead.isQualified
      ? `🔥 Lead Calificado: ${lead.contact.name} — ${lead.contact.city}`
      : `Lead recibido (automático): ${lead.contact.name}`;

    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject,
      html: buildLeadEmailHtml(lead),
    });
  } catch (error) {
    // Loguear el error pero no exponer detalles al cliente
    console.error('[submitLead] Resend error:', error);
    return {
      success: false,
      message: 'Hubo un problema al enviar tu solicitud. Por favor intenta nuevamente o llámanos directamente.',
    };
  }

  return {
    success: true,
    message: lead.isQualified
      ? 'Tu solicitud fue enviada. Uno de nuestros especialistas te contactará en las próximas 24 horas.'
      : 'Gracias por tu interés. Hemos recibido tu información.',
    leadId: lead.id,
  };
}
