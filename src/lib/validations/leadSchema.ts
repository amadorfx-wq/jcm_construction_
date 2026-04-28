// ─────────────────────────────────────────────────────────────────────────────
// JC Milian Construction — Lead Zod Schemas
// Validación por paso + schema final + transformación server-side (isQualified)
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod';
import type { FunnelStep } from '@/types';
import { DISQUALIFYING_BUDGET, FUNNEL_STEPS } from '@/types';

// ─── Schemas por paso ─────────────────────────────────────────────────────────

export const stepProjectTypeSchema = z.object({
  projectType: z.enum(['cocina', 'bano', 'deck', 'otro'], {
    required_error: 'Selecciona un tipo de proyecto',
    invalid_type_error: 'Tipo de proyecto inválido',
  }),
});

export const stepBudgetRangeSchema = z.object({
  budgetRange: z.enum(['under_15k', '15k_30k', '30k_60k', '60k_100k', 'over_100k'], {
    required_error: 'Selecciona un rango de inversión',
    invalid_type_error: 'Rango de inversión inválido',
  }),
});

export const stepFinancingSchema = z.object({
  financingIntent: z.enum(['yes', 'no', 'maybe'], {
    required_error: 'Indica tu preferencia de financiamiento',
    invalid_type_error: 'Opción de financiamiento inválida',
  }),
});

export const stepContactSchema = z.object({
  contact: z
    .object({
      name: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'Nombre demasiado largo'),
      email: z
        .string()
        .email('Ingresa un correo electrónico válido')
        .max(254, 'Email demasiado largo'),
      phone: z
        .string()
        .regex(
          /^[\+]?[\d\s\-\(\)]{7,20}$/,
          'Ingresa un número de teléfono válido'
        ),
      city: z
        .string()
        .min(2, 'La ciudad debe tener al menos 2 caracteres')
        .max(100, 'Nombre de ciudad demasiado largo'),
    }),
});

// ─── Schema completo del formulario ──────────────────────────────────────────

export const leadFormSchema = stepProjectTypeSchema
  .merge(stepBudgetRangeSchema)
  .merge(stepFinancingSchema)
  .merge(stepContactSchema);

export type LeadFormInput = z.infer<typeof leadFormSchema>;

// ─── Schema server-side: añade honeypot + derivados ──────────────────────────

/**
 * Solo se ejecuta dentro de 'use server' actions.
 * Nunca exponer isQualified / derivedToAutomation al cliente.
 */
export const inboundLeadSchema = leadFormSchema.transform((data) => {
  const isQualified = data.budgetRange !== DISQUALIFYING_BUDGET;
  return {
    ...data,
    id: crypto.randomUUID(),
    isQualified,
    derivedToAutomation: !isQualified,
    submittedAt: new Date().toISOString(),
  };
});

export type InboundLeadOutput = z.output<typeof inboundLeadSchema>;

// ─── Registry de schemas por paso (resolución dinámica en FunnelEngine) ──────

/**
 * `satisfies` rompe el build si FUNNEL_STEPS crece sin actualizar este map.
 * `as const` preserva los tipos literales de cada key.
 */
export const stepSchemaRegistry = {
  'project-type': stepProjectTypeSchema,
  'budget-range': stepBudgetRangeSchema,
  financing: stepFinancingSchema,
  contact: stepContactSchema,
} satisfies Record<FunnelStep, z.ZodTypeAny>;

// ─── Type guard ───────────────────────────────────────────────────────────────

export function isFunnelStep(value: unknown): value is FunnelStep {
  return FUNNEL_STEPS.includes(value as FunnelStep);
}
