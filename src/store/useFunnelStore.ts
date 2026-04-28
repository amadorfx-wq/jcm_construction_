// ─────────────────────────────────────────────────────────────────────────────
// JC Milian Construction — Zustand Funnel Store
// Estado global del embudo multi-paso con devtools en desarrollo
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  FUNNEL_STEPS,
  TOTAL_FUNNEL_STEPS,
  type FunnelStep,
  type LeadFormData,
  type ContactInfo,
  type ProjectType,
  type BudgetRange,
  type FinancingIntent,
} from '@/types';

// ─── State shape ──────────────────────────────────────────────────────────────

interface FunnelState {
  readonly currentStepIndex: number;
  readonly leadData: Partial<LeadFormData>;
  readonly isSubmitting: boolean;
  readonly isSubmitted: boolean;
  readonly submittedLeadId: string | null;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

interface FunnelActions {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: FunnelStep) => void;
  updateLeadData: (data: Partial<LeadFormData>) => void;
  setProjectType: (value: ProjectType) => void;
  setBudgetRange: (value: BudgetRange) => void;
  setFinancingIntent: (value: FinancingIntent) => void;
  setContact: (value: ContactInfo) => void;
  setIsSubmitting: (value: boolean) => void;
  setSubmitted: (leadId: string) => void;
  reset: () => void;
}

export type FunnelStore = FunnelState & FunnelActions;

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: FunnelState = {
  currentStepIndex: 0,
  leadData: {},
  isSubmitting: false,
  isSubmitted: false,
  submittedLeadId: null,
};

// ─── Helper: safe tuple indexing ─────────────────────────────────────────────

export function getStepAtIndex(index: number): FunnelStep {
  const step = FUNNEL_STEPS[index];
  if (step === undefined) {
    throw new RangeError(
      `getStepAtIndex: index ${index} is out of bounds [0, ${FUNNEL_STEPS.length - 1}]`
    );
  }
  return step;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useFunnelStore = create<FunnelStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      goToNextStep: () => {
        const { currentStepIndex } = get();
        if (currentStepIndex < TOTAL_FUNNEL_STEPS - 1) {
          set(
            { currentStepIndex: currentStepIndex + 1 },
            false,
            'funnel/goToNextStep'
          );
        }
      },

      goToPreviousStep: () => {
        const { currentStepIndex } = get();
        if (currentStepIndex > 0) {
          set(
            { currentStepIndex: currentStepIndex - 1 },
            false,
            'funnel/goToPreviousStep'
          );
        }
      },

      goToStep: (step: FunnelStep) => {
        const index = FUNNEL_STEPS.indexOf(step);
        if (index !== -1) {
          set({ currentStepIndex: index }, false, 'funnel/goToStep');
        }
      },

      updateLeadData: (data: Partial<LeadFormData>) => {
        set(
          (state) => ({ leadData: { ...state.leadData, ...data } }),
          false,
          'funnel/updateLeadData'
        );
      },

      setProjectType: (value: ProjectType) => {
        set(
          (state) => ({ leadData: { ...state.leadData, projectType: value } }),
          false,
          'funnel/setProjectType'
        );
      },

      setBudgetRange: (value: BudgetRange) => {
        set(
          (state) => ({ leadData: { ...state.leadData, budgetRange: value } }),
          false,
          'funnel/setBudgetRange'
        );
      },

      setFinancingIntent: (value: FinancingIntent) => {
        set(
          (state) => ({
            leadData: { ...state.leadData, financingIntent: value },
          }),
          false,
          'funnel/setFinancingIntent'
        );
      },

      setContact: (value: ContactInfo) => {
        set(
          (state) => ({ leadData: { ...state.leadData, contact: value } }),
          false,
          'funnel/setContact'
        );
      },

      setIsSubmitting: (value: boolean) => {
        set({ isSubmitting: value }, false, 'funnel/setIsSubmitting');
      },

      setSubmitted: (leadId: string) => {
        set(
          { isSubmitted: true, isSubmitting: false, submittedLeadId: leadId },
          false,
          'funnel/setSubmitted'
        );
      },

      reset: () => {
        set(initialState, false, 'funnel/reset');
      },
    }),
    {
      name: 'jcmilian-funnel',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectCurrentStepIndex = (s: FunnelStore) => s.currentStepIndex;
export const selectCurrentStep = (s: FunnelStore): FunnelStep =>
  getStepAtIndex(s.currentStepIndex);
export const selectProgressPercentage = (s: FunnelStore) =>
  Math.round(((s.currentStepIndex + 1) / TOTAL_FUNNEL_STEPS) * 100);
export const selectIsFirstStep = (s: FunnelStore) => s.currentStepIndex === 0;
export const selectIsLastStep = (s: FunnelStore) =>
  s.currentStepIndex === TOTAL_FUNNEL_STEPS - 1;
export const selectLeadData = (s: FunnelStore) => s.leadData;
export const selectIsSubmitting = (s: FunnelStore) => s.isSubmitting;
export const selectIsSubmitted = (s: FunnelStore) => s.isSubmitted;
export const selectSubmittedLeadId = (s: FunnelStore) => s.submittedLeadId;
