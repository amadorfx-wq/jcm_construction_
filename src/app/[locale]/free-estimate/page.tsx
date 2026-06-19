// ─────────────────────────────────────────────────────────────────────────────
// [locale] Evaluación de Proyecto — Página de Captación (Server Component)
// Copy estratégico desde dict. FunnelEngine = único Client Island.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import FunnelEngine from '@/components/Funnel/FunnelEngine';
import { getDictionary } from '@/i18n/getDictionary';
import type { Locale } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: `${dict.funnel.title} ${dict.funnel.titleAccent} | JC Milian Construction`,
  };
}

// ─── Íconos de señales de confianza ──────────────────────────────────────────

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="7" width="10" height="8" rx="1" stroke="#6b7280" strokeWidth="1.2" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="#6b7280" strokeWidth="1.2" />
      <path d="M8 5v3.5l2 2" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="#6b7280" strokeWidth="1.2" />
      <path d="M5.5 8l2 2 3-3" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default async function EvaluacionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const { funnel, funnelEngine } = dict;

  const trustItems = [
    { icon: <LockIcon />, ...funnel.trust.protected },
    { icon: <ClockIcon />, ...funnel.trust.response },
    { icon: <CheckIcon />, ...funnel.trust.noCommitment },
  ];

  return (
    <main className="max-w-3xl mx-auto px-6 py-20">

      {/* ── Encabezado estratégico ────────────────────────────────────────── */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="block w-6 h-px bg-rose-600 flex-shrink-0" aria-hidden="true" />
          <span className="text-xs text-rose-700 uppercase tracking-widest font-medium font-inter">
            {funnel.eyebrow}
          </span>
          <span className="block w-6 h-px bg-rose-600 flex-shrink-0" aria-hidden="true" />
        </div>

        <h1 className="font-playfair text-4xl lg:text-5xl font-semibold text-slate-900 leading-tight mb-6">
          {funnel.title}
          <br />
          <span className="text-slate-500">{funnel.titleAccent}</span>
        </h1>

        <p className="text-slate-600 font-inter text-base leading-relaxed max-w-xl mx-auto">
          {funnel.description}
        </p>
      </div>

      {/* ── FunnelEngine — Client Island ──────────────────────────────────── */}
      <div className="shadow-luxury-lg rounded-sm overflow-hidden">
        <FunnelEngine dict={funnelEngine} />
      </div>

      {/* ── Señales de confianza post-CTA ─────────────────────────────────── */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {trustItems.map(({ icon, label, description }) => (
          <div
            key={label}
            className="flex flex-col items-center text-center gap-2 px-4 py-5 bg-white rounded-sm border border-slate-100 shadow-luxury"
          >
            <span className="text-slate-400">{icon}</span>
            <span className="text-xs font-semibold text-slate-700 font-inter">{label}</span>
            <span className="text-[11px] text-slate-400 leading-snug font-inter">{description}</span>
          </div>
        ))}
      </div>

      {/* ── Nota legal ────────────────────────────────────────────────────── */}
      <p className="mt-8 text-center text-[11px] text-slate-400 font-inter leading-snug">
        {funnel.legal}
      </p>
    </main>
  );
}
