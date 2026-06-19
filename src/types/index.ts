// ─────────────────────────────────────────────────────────────────────────────
// JC Milian Construction — Domain Types
// TypeScript strict: true · No `any` · All interfaces readonly
// ─────────────────────────────────────────────────────────────────────────────

// ─── Lead / Funnel Types ─────────────────────────────────────────────────────

export type ProjectType = 'cocina' | 'bano' | 'deck' | 'otro';

export interface LeadFormData {
  readonly name: string;
  readonly phone: string;
  readonly email: string;
  readonly projectType: ProjectType;
  readonly wantsFinancing: 'yes' | 'no';
  readonly consentSms: boolean;
}

export interface InboundLead extends LeadFormData {
  readonly id: string;
  readonly submittedAt: string;
}

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
