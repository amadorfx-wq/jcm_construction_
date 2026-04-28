// ─────────────────────────────────────────────────────────────────────────────
// [locale] Silo: Construcción de Decks — Server Component
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import Link from 'next/link';
import CaseStudyCard from '@/components/Portfolio/CaseStudyCard';
import RiskReversal from '@/components/Trust/RiskReversal';
import { getProjectsByType } from '@/lib/data/portfolio';
import { getDictionary } from '@/i18n/getDictionary';
import type { Locale } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs
      ? 'Construcción de Decks y Exteriores | JC Milian Construction'
      : 'Deck & Exterior Construction | JC Milian Construction',
    description: isEs
      ? 'Decks de lujo en Atlanta, GA. Trex Transcend con garantía 25 años, pérgolas de cedro, iluminación LED.'
      : 'Luxury decks in Atlanta, GA. Trex Transcend with 25-year warranty, cedar pergolas, LED lighting.',
  };
}

export default async function ConstruccionDecksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const silo = dict.silos.decks;
  const project = getProjectsByType('deck', locale)[0];

  return (
    <main>
      {/* ── Hero Dark ─────────────────────────────────────────────────────── */}
      <section className="relative bg-[#0a0a0c] py-32 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(190,18,60,0.07) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="block w-8 h-px bg-rose-600 flex-shrink-0" aria-hidden="true" />
            <span className="text-xs text-rose-700 uppercase tracking-widest font-medium font-inter">
              {silo.eyebrow}
            </span>
            <span className="block w-8 h-px bg-rose-600 flex-shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-playfair text-5xl md:text-7xl font-semibold text-white leading-tight mb-8">
            {silo.headline}
          </h1>
          <p className="text-gray-400 font-inter text-lg leading-relaxed max-w-2xl mx-auto mb-12">
            {silo.subtext}
          </p>
          <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto">
            {silo.stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-playfair text-3xl font-semibold text-white">{value}</p>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider font-inter mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Motor de Confianza + Caso de Estudio ─────────────────────────── */}
      <section className="bg-[#FAFAFB] py-24">
        <div className="max-w-5xl mx-auto px-6 space-y-16">
          <RiskReversal dict={dict.riskReversal} />
          {project ? <CaseStudyCard project={project} dict={dict.caseStudyCard} /> : null}
        </div>
      </section>

      {/* ── CTA Final ─────────────────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-xs text-rose-700 uppercase tracking-widest font-medium font-inter mb-4">
            {silo.eyebrow}
          </p>
          <h2 className="font-playfair text-4xl font-semibold text-slate-900 mb-6">
            {silo.ctaTitle}
          </h2>
          <p className="text-slate-500 font-inter text-base leading-relaxed mb-10">
            {silo.ctaText}
          </p>
          <Link
            href={`/${locale}/evaluacion-proyecto`}
            className="inline-block bg-[#0a0a0c] text-white font-inter text-sm font-medium px-10 py-4 rounded-sm hover:bg-slate-800 transition-colors duration-200 tracking-wide"
          >
            {silo.ctaButton}
          </Link>
        </div>
      </section>
    </main>
  );
}
