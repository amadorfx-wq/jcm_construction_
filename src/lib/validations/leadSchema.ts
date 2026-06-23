// ─────────────────────────────────────────────────────────────────────────────
// JC Milian Construction — Lead Zod Schema
// Formulario único de 4 campos. Sin multipaso, sin registros por paso.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod';

// ─── Schema del formulario ────────────────────────────────────────────────────

export const leadFormSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'Nombre demasiado largo'),
  phone: z
    .string()
    .regex(
      /^[\+]?[\d\s\-\(\)]{7,20}$/,
      'Ingresa un número de teléfono válido'
    ),
  email: z
    .union([
      z.string().email('Ingresa un correo electrónico válido'),
      z.literal(''),
    ])
    .default(''),
  projectType: z.enum(['cocina', 'bano', 'deck', 'otro'], {
    required_error: 'Selecciona un tipo de proyecto',
    invalid_type_error: 'Tipo de proyecto inválido',
  }),
  wantsFinancing: z.enum(['yes', 'no'], {
    required_error: 'Indica tu preferencia de financiamiento',
    invalid_type_error: 'Opción de financiamiento inválida',
  }),
  consentSms: z.boolean().default(false),
});

export type LeadFormInput = z.infer<typeof leadFormSchema>;

// ─── Schema server-side: añade id y timestamp ─────────────────────────────────

export const inboundLeadSchema = leadFormSchema.transform((data) => ({
  ...data,
  id: crypto.randomUUID(),
  submittedAt: new Date().toISOString(),
}));

export type InboundLeadOutput = z.output<typeof inboundLeadSchema>;
