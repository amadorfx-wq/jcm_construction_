// ─────────────────────────────────────────────────────────────────────────────
// JC Milian Construction — Domain Types
// TypeScript strict: true · No `any` · All interfaces readonly
// ─────────────────────────────────────────────────────────────────────────────

// ─── Funnel / Lead Types ─────────────────────────────────────────────────────

export type ProjectType = 'cocina' | 'bano' | 'deck' | 'otro';

export type BudgetRange =
  | 'under_15k'
  | '15k_30k'
  | '30k_60k'
  | '60k_100k'
  | 'over_100k';

export type FinancingIntent = 'yes' | 'no' | 'maybe';

export interface ContactInfo {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly city: string;
}

export interface LeadFormData {
  readonly projectType: ProjectType;
  readonly budgetRange: BudgetRange;
  readonly financingIntent: FinancingIntent;
  readonly contact: ContactInfo;
}

export interface InboundLead extends LeadFormData {
  readonly id: string;
  readonly isQualified: boolean;
  readonly derivedToAutomation: boolean;
  readonly submittedAt: string;
}

/** Presupuesto mínimo que descalifica al lead del proceso de ventas manual. */
export const DISQUALIFYING_BUDGET: BudgetRange = 'under_15k';

// ─── Funnel Navigation ───────────────────────────────────────────────────────

export const FUNNEL_STEPS = [
  'project-type',
  'budget-range',
  'financing',
  'contact',
] as const;

export type FunnelStep = (typeof FUNNEL_STEPS)[number];
export const TOTAL_FUNNEL_STEPS = FUNNEL_STEPS.length;

// ─── Portfolio / Project Types ────────────────────────────────────────────────

/**
 * role distingue el propósito de la imagen en la UI:
 * - 'before'  → imagen de estado previo en el slider de CaseStudyCard
 * - 'after'   → imagen de resultado final en el slider de CaseStudyCard
 * - 'gallery' → imagen adicional (galería, detalle, ambiente)
 *
 * Campo opcional para retrocompatibilidad con datos sin role asignado.
 * CaseStudyCard hace fallback a índices [0] / [1] si role no está presente.
 */
export interface ProjectImage {
  readonly url: string;
  readonly alt: string;
  readonly isCover: boolean;
  readonly role?: 'before' | 'after' | 'gallery';
}

/**
 * Inversión almacenada en centavos para evitar errores de punto flotante.
 * Usar formatCents() de @/lib/utils para mostrar en UI.
 */
export interface InvestmentRange {
  readonly minCents: number;
  readonly maxCents: number;
}

export type ProjectCategory = 'cocina' | 'bano' | 'deck';

export interface LocalizedContent {
  readonly title: string;
  readonly description: string;
  readonly highlights: readonly string[];
}

export interface PortfolioProject {
  readonly id: string;
  readonly slug: string;
  readonly category: ProjectCategory;
  readonly location: string;
  readonly durationWeeks: number;
  readonly investmentRange: InvestmentRange;
  readonly content: {
    readonly en: LocalizedContent;
    readonly es: LocalizedContent;
  };
  readonly images: readonly ProjectImage[];
  readonly featured: boolean;
  readonly completedAt: string; // ISO date string YYYY-MM-DD
}

// ─── Server Action Results ────────────────────────────────────────────────────

export interface SubmitLeadResult {
  readonly success: boolean;
  readonly message: string;
  readonly leadId?: string;
}
