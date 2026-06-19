'use client';

// ─────────────────────────────────────────────────────────────────────────────
// FunnelEngine — Client Component
// Formulario único de alta conversión. Estado local, submit con Zod + Server Action.
// Mobile-First. Touch cards. Cero código multipaso.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useTransition } from 'react';
import { useFunnelStore, selectIsSubmitted } from '@/store/useFunnelStore';
import { leadFormSchema } from '@/lib/validations/leadSchema';
import { submitLead } from '@/actions/submitLead';
import type { LeadFormData } from '@/types';

// ─── Dict type ────────────────────────────────────────────────────────────────

interface FunnelEngineDict {
  form: {
    question: string;
    subtitle: string;
    fields: {
      name: string;
      phone: string;
      email: string;
      projectType: string;
      financing: string;
    };
    placeholders: {
      name: string;
      phone: string;
      email: string;
    };
    projectOptions: {
      cocina: string;
      bano: string;
      deck: string;
      otro: string;
    };
    financingOptions: {
      yes: string;
      no: string;
    };
    consentSms: {
      text: string;
      error: string;
    };
  };
  trustBadges: string[];
  success: {
    title: string;
    body: string;
    highlights: Array<{ label: string; sub: string }>;
  };
  buttons: {
    getEstimate: string;
    submitting: string;
  };
}

interface FunnelEngineProps {
  dict: FunnelEngineDict;
}

// ─── Sub-componente: SuccessScreen ────────────────────────────────────────────

function SuccessScreen({ success }: { success: FunnelEngineDict['success'] }) {
  return (
    <div className="flex flex-col items-center text-center py-8 gap-6">
      <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M6 14l5.5 5.5L22 8.5" stroke="#FAFAFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="font-playfair text-2xl font-semibold text-slate-900">{success.title}</h2>
        <p className="text-slate-500 text-sm leading-relaxed font-inter max-w-xs mx-auto">
          {success.body}
        </p>
      </div>
      <div className="w-full grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
        {success.highlights.map(({ label, sub }) => (
          <div key={label} className="flex flex-col gap-1 text-center">
            <span className="text-xs font-semibold text-slate-700">{label}</span>
            <span className="text-[10px] text-slate-400 leading-snug">{sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function FunnelEngine({ dict }: FunnelEngineProps) {
  const isSubmitted    = useFunnelStore(selectIsSubmitted);
  const updateLeadData = useFunnelStore((s) => s.updateLeadData);
  const setSubmitted   = useFunnelStore((s) => s.setSubmitted);

  // Estado local — evita re-renders globales hasta el submit
  const [formData,    setFormData]    = useState<Partial<LeadFormData>>({});
  const [errors,      setErrors]      = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [honeypot,    setHoneypot]    = useState('');

  const [isPending, startTransition] = useTransition();

  // ─── Clases reutilizables ─────────────────────────────────────────────────

  const inputClass = (hasError: boolean) =>
    [
      'w-full px-4 py-4 text-sm rounded-sm border',
      'bg-white text-slate-900 placeholder:text-slate-400',
      'focus:outline-none focus:ring-2 focus:ring-rose-600/20 focus:border-rose-600',
      'transition-all duration-150',
      hasError ? 'border-rose-400' : 'border-slate-200',
    ].join(' ');

  const cardClass = (selected: boolean) =>
    [
      'min-h-[60px] flex items-center justify-center px-4 py-3',
      'text-sm font-medium font-inter rounded-sm border text-center',
      'transition-all duration-150 cursor-pointer select-none',
      selected
        ? 'ring-2 ring-rose-600 border-rose-600 bg-rose-50 text-rose-900'
        : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50',
    ].join(' ');

  // ─── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = () => {
    if (formData.consentSms !== true) {
      setErrors((p) => ({ ...p, consentSms: dict.form.consentSms.error }));
      return;
    }

    const result = leadFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LeadFormData, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LeadFormData;
        if (field && !fieldErrors[field]) {
          // Use dict-based error for consentSms, Zod message for everything else
          if (field === 'consentSms') {
            fieldErrors[field] = dict.form.consentSms.error;
          } else {
            fieldErrors[field] = issue.message;
          }
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitError(null);

    startTransition(async () => {
      updateLeadData(result.data);
      const res = await submitLead({ ...result.data, website: honeypot });
      if (res.success) {
        setSubmitted(res.leadId ?? crypto.randomUUID());
      } else {
        setSubmitError(res.message);
      }
    });
  };

  // ─── Success state ────────────────────────────────────────────────────────

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-xl shadow-luxury-lg overflow-hidden p-6 md:p-8">
        <SuccessScreen success={dict.success} />
      </div>
    );
  }

  // ─── Form ─────────────────────────────────────────────────────────────────

  return (
    <div className="bg-white rounded-xl shadow-luxury-lg overflow-hidden p-6 md:p-8">

      {/* Header */}
      <div className="mb-6">
        <h2 className="font-playfair text-2xl font-semibold text-slate-900 mb-2">
          {dict.form.question}
        </h2>
        <p className="text-sm text-slate-500 font-inter">{dict.form.subtitle}</p>
      </div>

      <div className="flex flex-col gap-5">

        {/* ── Nombre ───────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="funnel-name" className="text-sm font-medium text-slate-700">
            {dict.form.fields.name}
          </label>
          <input
            id="funnel-name"
            type="text"
            autoComplete="name"
            value={formData.name ?? ''}
            onChange={(e) => {
              setFormData((p) => ({ ...p, name: e.target.value }));
              if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
            }}
            placeholder={dict.form.placeholders.name}
            className={inputClass(!!errors.name)}
          />
          {errors.name && (
            <p className="text-xs text-rose-600 font-inter" role="alert">{errors.name}</p>
          )}
        </div>

        {/* ── Teléfono — teclado numérico nativo en iOS ─────────────────────── */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="funnel-phone" className="text-sm font-medium text-slate-700">
            {dict.form.fields.phone}
          </label>
          <input
            id="funnel-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={formData.phone ?? ''}
            onChange={(e) => {
              setFormData((p) => ({ ...p, phone: e.target.value }));
              if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
            }}
            placeholder={dict.form.placeholders.phone}
            className={inputClass(!!errors.phone)}
          />
          {errors.phone && (
            <p className="text-xs text-rose-600 font-inter" role="alert">{errors.phone}</p>
          )}
        </div>

        {/* ── Email (opcional) ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="funnel-email" className="text-sm font-medium text-slate-700">
            {dict.form.fields.email}
          </label>
          <input
            id="funnel-email"
            type="email"
            autoComplete="email"
            value={formData.email ?? ''}
            onChange={(e) => {
              setFormData((p) => ({ ...p, email: e.target.value }));
              if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
            }}
            placeholder={dict.form.placeholders.email}
            className={inputClass(!!errors.email)}
          />
          {errors.email && (
            <p className="text-xs text-rose-600 font-inter" role="alert">{errors.email}</p>
          )}
        </div>

        {/* ── Tipo de Proyecto — touch cards 2×2 ──────────────────────────── */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">
            {dict.form.fields.projectType}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(['cocina', 'bano', 'deck', 'otro'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setFormData((p) => ({ ...p, projectType: value }));
                  if (errors.projectType) setErrors((p) => ({ ...p, projectType: undefined }));
                }}
                className={cardClass(formData.projectType === value)}
                aria-pressed={formData.projectType === value}
              >
                {dict.form.projectOptions[value]}
              </button>
            ))}
          </div>
          {errors.projectType && (
            <p className="text-xs text-rose-600 font-inter" role="alert">{errors.projectType}</p>
          )}
        </div>

        {/* ── Financiamiento — touch cards 2×1 ────────────────────────────── */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">
            {dict.form.fields.financing}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(['yes', 'no'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setFormData((p) => ({ ...p, wantsFinancing: value }));
                  if (errors.wantsFinancing) setErrors((p) => ({ ...p, wantsFinancing: undefined }));
                }}
                className={cardClass(formData.wantsFinancing === value)}
                aria-pressed={formData.wantsFinancing === value}
              >
                {dict.form.financingOptions[value]}
              </button>
            ))}
          </div>
          {errors.wantsFinancing && (
            <p className="text-xs text-rose-600 font-inter" role="alert">{errors.wantsFinancing}</p>
          )}
        </div>

        {/* ── SMS Consent Checkbox (A2P 10DLC compliance) ──────────────────── */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              id="funnel-consent-sms"
              type="checkbox"
              checked={formData.consentSms === true}
              onChange={(e) => {
                setFormData((p) => ({ ...p, consentSms: e.target.checked }));
                if (errors.consentSms) setErrors((p) => ({ ...p, consentSms: undefined }));
              }}
              className="mt-0.5 h-4 w-4 rounded-sm border-slate-300 accent-rose-600 cursor-pointer flex-shrink-0"
            />
            <span className="text-xs text-slate-500 leading-relaxed font-inter">
              {dict.form.consentSms.text}
            </span>
          </label>
          {errors.consentSms && (
            <p className="text-xs text-rose-600 font-inter" role="alert">{errors.consentSms}</p>
          )}
        </div>

        {/* ── Error de envío ────────────────────────────────────────────────── */}
        {submitError && (
          <p className="text-sm text-rose-700 font-medium font-inter text-center" role="alert">
            {submitError}
          </p>
        )}

        {/* ── Trust Badges ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1">
          {dict.trustBadges.map((badge, i) => (
            <span key={badge} className="flex items-center gap-2 text-xs text-slate-400 font-inter">
              {i > 0 && <span aria-hidden="true" className="text-slate-300">·</span>}
              {badge}
            </span>
          ))}
        </div>

        {/* ── Botón submit masivo ───────────────────────────────────────────── */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className={[
            'w-full py-4 text-sm font-semibold rounded-sm',
            'transition-all duration-150',
            isPending
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-slate-900 text-white hover:bg-slate-800 cursor-pointer active:scale-[0.99]',
          ].join(' ')}
        >
          {isPending ? dict.buttons.submitting : dict.buttons.getEstimate}
        </button>

        {/* ── Honeypot anti-spam (oculto para humanos, visible para bots) ──── */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
        />

      </div>
    </div>
  );
}
