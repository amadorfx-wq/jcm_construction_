'use client';

// ─────────────────────────────────────────────────────────────────────────────
// FunnelEngine — Client Component
// Recibe dict del Server Page. Cero texto hardcodeado.
// Motor de captación multi-paso. Máquina registradora del negocio.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useTransition } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  useFunnelStore,
  selectCurrentStep,
  selectCurrentStepIndex,
  selectProgressPercentage,
  selectIsFirstStep,
  selectIsLastStep,
  selectIsSubmitted,
} from '@/store/useFunnelStore';
import { stepSchemaRegistry } from '@/lib/validations/leadSchema';
import { submitLead } from '@/actions/submitLead';
import type {
  ProjectType,
  BudgetRange,
  FinancingIntent,
  ContactInfo,
  FunnelStep,
} from '@/types';

// ─── Dict type (inferido desde JSON — no importa server-only) ─────────────────

interface StepOption {
  label: string;
  description: string;
}

interface FunnelEngineDict {
  step1: {
    counter: string;
    question: string;
    options: { cocina: StepOption; bano: StepOption; deck: StepOption; otro: StepOption };
  };
  step2: {
    counter: string;
    question: string;
    subtitle: string;
    options: {
      under_15k: StepOption;
      '15k_30k': StepOption;
      '30k_60k': StepOption;
      '60k_100k': StepOption;
      over_100k: StepOption;
    };
  };
  step3: {
    counter: string;
    question: string;
    subtitle: string;
    options: { yes: StepOption; maybe: StepOption; no: StepOption };
  };
  step4: {
    counter: string;
    question: string;
    subtitle: string;
    fields: { name: string; email: string; phone: string; city: string };
    placeholders: { name: string; email: string; phone: string; city: string };
  };
  success: {
    title: string;
    body: string;
    highlights: Array<{ label: string; sub: string }>;
  };
  buttons: { back: string; continue: string; submit: string; submitting: string };
  stepCounter: string;
}

// ─── Variantes de animación — curva iOS nativa ────────────────────────────────

const slideVariants = {
  enter:  (dir: number) => ({ x: dir * 40, opacity: 0 }),
  center:              ({ x: 0,          opacity: 1 }),
  exit:   (dir: number) => ({ x: dir * -40, opacity: 0 }),
};

const reducedVariants = {
  enter:  { opacity: 0 },
  center: { opacity: 1 },
  exit:   { opacity: 0 },
};

const iosTransition = {
  duration: 0.28,
  ease: [0.16, 1, 0.3, 1] as const,
};

// ─── Sub-componente: ProgressBar ──────────────────────────────────────────────

function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="w-full h-px bg-slate-100" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
      <div
        className="h-px bg-rose-600 transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

// ─── Sub-componente: SelectionCard ────────────────────────────────────────────

interface SelectionCardProps {
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

function SelectionCard({ label, description, selected, onSelect }: SelectionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        'flex items-start gap-4 w-full text-left px-5 py-4 rounded-sm border',
        'transition-all duration-150 cursor-pointer min-h-[44px]',
        selected
          ? 'border-rose-700 ring-2 ring-rose-700 bg-rose-50/40'
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50',
      ].join(' ')}
      aria-pressed={selected}
    >
      <span
        className={[
          'mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center',
          selected ? 'border-rose-700' : 'border-slate-300',
        ].join(' ')}
        aria-hidden="true"
      >
        {selected && <span className="w-2 h-2 rounded-full bg-rose-700" />}
      </span>
      <div className="flex flex-col gap-0.5">
        <span className={['text-sm font-medium', selected ? 'text-slate-900' : 'text-slate-700'].join(' ')}>
          {label}
        </span>
        <span className="text-xs text-slate-400 font-inter leading-snug">{description}</span>
      </div>
    </button>
  );
}

// ─── Sub-componentes: Pasos ───────────────────────────────────────────────────

function StepProjectType({
  selected, onSelect, step1,
}: { selected: ProjectType | null; onSelect: (v: ProjectType) => void; step1: FunnelEngineDict['step1'] }) {
  const opts: Array<{ value: ProjectType; opt: StepOption }> = [
    { value: 'cocina', opt: step1.options.cocina },
    { value: 'bano',   opt: step1.options.bano },
    { value: 'deck',   opt: step1.options.deck },
    { value: 'otro',   opt: step1.options.otro },
  ];
  return (
    <div className="flex flex-col gap-3">
      <div className="mb-2">
        <p className="text-xs text-rose-700 uppercase tracking-widest font-medium mb-1">{step1.counter}</p>
        <h2 className="font-playfair text-2xl font-semibold text-slate-900">{step1.question}</h2>
      </div>
      {opts.map(({ value, opt }) => (
        <SelectionCard
          key={value}
          label={opt.label}
          description={opt.description}
          selected={selected === value}
          onSelect={() => onSelect(value)}
        />
      ))}
    </div>
  );
}

function StepBudgetRange({
  selected, onSelect, step2,
}: { selected: BudgetRange | null; onSelect: (v: BudgetRange) => void; step2: FunnelEngineDict['step2'] }) {
  const opts: Array<{ value: BudgetRange; opt: StepOption }> = [
    { value: 'under_15k', opt: step2.options.under_15k },
    { value: '15k_30k',   opt: step2.options['15k_30k'] },
    { value: '30k_60k',   opt: step2.options['30k_60k'] },
    { value: '60k_100k',  opt: step2.options['60k_100k'] },
    { value: 'over_100k', opt: step2.options.over_100k },
  ];
  return (
    <div className="flex flex-col gap-3">
      <div className="mb-2">
        <p className="text-xs text-rose-700 uppercase tracking-widest font-medium mb-1">{step2.counter}</p>
        <h2 className="font-playfair text-2xl font-semibold text-slate-900">{step2.question}</h2>
        <p className="text-sm text-slate-500 mt-1 font-inter">{step2.subtitle}</p>
      </div>
      {opts.map(({ value, opt }) => (
        <SelectionCard
          key={value}
          label={opt.label}
          description={opt.description}
          selected={selected === value}
          onSelect={() => onSelect(value)}
        />
      ))}
    </div>
  );
}

function StepFinancing({
  selected, onSelect, step3,
}: { selected: FinancingIntent | null; onSelect: (v: FinancingIntent) => void; step3: FunnelEngineDict['step3'] }) {
  const opts: Array<{ value: FinancingIntent; opt: StepOption }> = [
    { value: 'yes',   opt: step3.options.yes },
    { value: 'maybe', opt: step3.options.maybe },
    { value: 'no',    opt: step3.options.no },
  ];
  return (
    <div className="flex flex-col gap-3">
      <div className="mb-2">
        <p className="text-xs text-rose-700 uppercase tracking-widest font-medium mb-1">{step3.counter}</p>
        <h2 className="font-playfair text-2xl font-semibold text-slate-900">{step3.question}</h2>
        <p className="text-sm text-slate-500 mt-1 font-inter">{step3.subtitle}</p>
      </div>
      {opts.map(({ value, opt }) => (
        <SelectionCard
          key={value}
          label={opt.label}
          description={opt.description}
          selected={selected === value}
          onSelect={() => onSelect(value)}
        />
      ))}
    </div>
  );
}

function StepContactInfo({
  data, onChange, step4,
}: { data: Partial<ContactInfo>; onChange: (field: keyof ContactInfo, value: string) => void; step4: FunnelEngineDict['step4'] }) {
  const inputClass = 'w-full px-4 py-3 text-sm border border-slate-200 rounded-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-700 focus:ring-2 focus:ring-rose-700/20 transition-all duration-150';
  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2">
        <p className="text-xs text-rose-700 uppercase tracking-widest font-medium mb-1">{step4.counter}</p>
        <h2 className="font-playfair text-2xl font-semibold text-slate-900">{step4.question}</h2>
        <p className="text-sm text-slate-500 mt-1 font-inter">{step4.subtitle}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-name" className="text-sm font-medium text-slate-700">{step4.fields.name}</label>
        <input
          id="contact-name" type="text" autoComplete="name"
          value={data.name ?? ''} onChange={(e) => onChange('name', e.target.value)}
          placeholder={step4.placeholders.name} className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-email" className="text-sm font-medium text-slate-700">{step4.fields.email}</label>
        <input
          id="contact-email" type="email" autoComplete="email"
          value={data.email ?? ''} onChange={(e) => onChange('email', e.target.value)}
          placeholder={step4.placeholders.email} className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-phone" className="text-sm font-medium text-slate-700">{step4.fields.phone}</label>
        <input
          id="contact-phone" type="tel" autoComplete="tel"
          value={data.phone ?? ''} onChange={(e) => onChange('phone', e.target.value)}
          placeholder={step4.placeholders.phone} className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-city" className="text-sm font-medium text-slate-700">{step4.fields.city}</label>
        <input
          id="contact-city" type="text" autoComplete="address-level2"
          value={data.city ?? ''} onChange={(e) => onChange('city', e.target.value)}
          placeholder={step4.placeholders.city} className={inputClass}
        />
      </div>
    </div>
  );
}

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

// ─── Helper ───────────────────────────────────────────────────────────────────

function buildStepData(
  step: FunnelStep,
  projectType: ProjectType | null,
  budgetRange: BudgetRange | null,
  financingIntent: FinancingIntent | null,
  contact: Partial<ContactInfo>
): Record<string, unknown> {
  switch (step) {
    case 'project-type': return { projectType };
    case 'budget-range': return { budgetRange };
    case 'financing':    return { financingIntent };
    case 'contact':      return { contact };
  }
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function FunnelEngine({ dict }: { dict: FunnelEngineDict }) {
  const currentStep        = useFunnelStore(selectCurrentStep);
  const currentStepIndex   = useFunnelStore(selectCurrentStepIndex);
  const progressPercentage = useFunnelStore(selectProgressPercentage);
  const isFirstStep        = useFunnelStore(selectIsFirstStep);
  const isLastStep         = useFunnelStore(selectIsLastStep);
  const isSubmitted        = useFunnelStore(selectIsSubmitted);
  const goToNextStep       = useFunnelStore((s) => s.goToNextStep);
  const goToPreviousStep   = useFunnelStore((s) => s.goToPreviousStep);
  const updateLeadData     = useFunnelStore((s) => s.updateLeadData);
  const setSubmitted       = useFunnelStore((s) => s.setSubmitted);

  const [projectType,     setProjectType]    = useState<ProjectType | null>(null);
  const [budgetRange,     setBudgetRange]     = useState<BudgetRange | null>(null);
  const [financingIntent, setFinancingIntent] = useState<FinancingIntent | null>(null);
  const [contact,         setContactData]     = useState<Partial<ContactInfo>>({});
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitError,     setSubmitError]     = useState<string | null>(null);
  const [direction,       setDirection]       = useState<1 | -1>(1);

  const [isPending, startTransition] = useTransition();
  const shouldReduceMotion = useReducedMotion();
  const variants           = shouldReduceMotion ? reducedVariants : slideVariants;

  const handleContactChange = (field: keyof ContactInfo, value: string) => {
    setContactData((prev) => ({ ...prev, [field]: value }));
    if (validationError) setValidationError(null);
  };

  const handleNext = () => {
    const stepData = buildStepData(currentStep, projectType, budgetRange, financingIntent, contact);
    const schema   = stepSchemaRegistry[currentStep];
    const result   = schema.safeParse(stepData);

    if (!result.success) {
      setValidationError(result.error.issues[0]?.message ?? 'Selecciona una opción para continuar.');
      return;
    }

    setValidationError(null);
    updateLeadData(stepData as Parameters<typeof updateLeadData>[0]);

    if (isLastStep) {
      const payload = {
        projectType:     projectType!,
        budgetRange:     budgetRange!,
        financingIntent: financingIntent!,
        contact:         contact as ContactInfo,
        website:         '',
      };
      startTransition(async () => {
        const res = await submitLead(payload);
        if (res.success) {
          setSubmitted(res.leadId ?? crypto.randomUUID());
        } else {
          setSubmitError(res.message);
        }
      });
    } else {
      setDirection(1);
      goToNextStep();
    }
  };

  const handleBack = () => {
    setValidationError(null);
    setDirection(-1);
    goToPreviousStep();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'project-type':
        return <StepProjectType selected={projectType} onSelect={(v) => { setProjectType(v); setValidationError(null); }} step1={dict.step1} />;
      case 'budget-range':
        return <StepBudgetRange selected={budgetRange} onSelect={(v) => { setBudgetRange(v); setValidationError(null); }} step2={dict.step2} />;
      case 'financing':
        return <StepFinancing selected={financingIntent} onSelect={(v) => { setFinancingIntent(v); setValidationError(null); }} step3={dict.step3} />;
      case 'contact':
        return <StepContactInfo data={contact} onChange={handleContactChange} step4={dict.step4} />;
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-sm shadow-luxury-lg overflow-hidden">
        <ProgressBar percentage={100} />
        <div className="p-8"><SuccessScreen success={dict.success} /></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-sm shadow-luxury-lg overflow-hidden">
      <ProgressBar percentage={progressPercentage} />

      <div className="p-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStepIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={iosTransition}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {validationError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-sm text-rose-700 font-medium font-inter"
            role="alert"
          >
            {validationError}
          </motion.p>
        )}

        {submitError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-sm text-rose-700 font-medium font-inter"
            role="alert"
          >
            {submitError}
          </motion.p>
        )}

        <div className={['flex mt-8 gap-3', isFirstStep ? 'justify-end' : 'justify-between'].join(' ')}>
          {!isFirstStep && (
            <button
              type="button"
              onClick={handleBack}
              disabled={isPending}
              className="px-5 py-2.5 text-sm text-slate-500 border border-slate-200 rounded-sm hover:border-slate-300 hover:text-slate-700 transition-all duration-150 cursor-pointer disabled:opacity-40"
            >
              {dict.buttons.back}
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={isPending}
            aria-disabled={isPending}
            className={[
              'flex-1 md:flex-none md:min-w-[140px] px-6 py-2.5 text-sm font-medium rounded-sm',
              'transition-all duration-150 cursor-pointer',
              isPending
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-slate-900 text-brand-cream hover:bg-slate-800',
            ].join(' ')}
          >
            {isPending
              ? dict.buttons.submitting
              : isLastStep
              ? dict.buttons.submit
              : dict.buttons.continue}
          </button>
        </div>

        {/* Honeypot anti-spam */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] w-px h-px overflow-hidden"
          style={{ position: 'absolute', left: '-9999px' }}
        />

        <p className="mt-6 text-center text-xs text-slate-400 font-inter">
          {currentStepIndex + 1} {dict.stepCounter}
        </p>
      </div>
    </div>
  );
}
