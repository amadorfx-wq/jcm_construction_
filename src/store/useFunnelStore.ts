// ─────────────────────────────────────────────────────────────────────────────
// JC Milian Construction — Zustand Funnel Store
// Formulario único. Sin multipaso. Estado mínimo y acciones directas.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { LeadFormData } from '@/types';

// ─── State ────────────────────────────────────────────────────────────────────

interface FunnelState {
  readonly leadData: Partial<LeadFormData>;
  readonly isSubmitted: boolean;
  readonly submittedLeadId: string | null;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

interface FunnelActions {
  updateLeadData: (data: Partial<LeadFormData>) => void;
  setSubmitted: (leadId: string) => void;
  reset: () => void;
}

export type FunnelStore = FunnelState & FunnelActions;

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: FunnelState = {
  leadData: {},
  isSubmitted: false,
  submittedLeadId: null,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useFunnelStore = create<FunnelStore>()(
  devtools(
    (set) => ({
      ...initialState,

      updateLeadData: (data: Partial<LeadFormData>) =>
        set(
          (state) => ({ leadData: { ...state.leadData, ...data } }),
          false,
          'funnel/updateLeadData'
        ),

      setSubmitted: (leadId: string) =>
        set(
          { isSubmitted: true, submittedLeadId: leadId },
          false,
          'funnel/setSubmitted'
        ),

      reset: () => set(initialState, false, 'funnel/reset'),
    }),
    {
      name: 'jcmilian-funnel',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectLeadData = (s: FunnelStore) => s.leadData;
export const selectIsSubmitted = (s: FunnelStore) => s.isSubmitted;
export const selectSubmittedLeadId = (s: FunnelStore) => s.submittedLeadId;
