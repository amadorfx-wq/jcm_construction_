// ─────────────────────────────────────────────────────────────────────────────
// [locale] Homepage — Server Component
// Texto 100% desde diccionario. Cero strings hardcodeados.
// Video hero cinematic background con parallax scroll-driven.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import Link from 'next/link';
import { getFeaturedProject } from '@/lib/data/portfolio';
import CaseStudyCard from '@/components/Portfolio/CaseStudyCard';
import RiskReversal from '@/components/Trust/RiskReversal';
import VideoHero from '@/components/layout/VideoHero';
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
    title: 'JC Milian Construction — Premium Remodeling Atlanta, GA',
    description: dict.hero.subtext,
  };
}

// ─── Íconos SVG de servicios (sin texto — texto viene del dict) ───────────────

function KitchenIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="3" y="8" width="22" height="16" rx="1.5" stroke="#1e293b" strokeWidth="1.25" />
      <path d="M3 12h22" stroke="#1e293b" strokeWidth="1.25" />
      <circle cx="9" cy="4.5" r="1.5" stroke="#1e293b" strokeWidth="1.25" />
      <circle cx="14" cy="4.5" r="1.5" stroke="#1e293b" strokeWidth="1.25" />
      <circle cx="19" cy="4.5" r="1.5" stroke="#1e293b" strokeWidth="1.25" />
      <path d="M9 17h2M9 21h2" stroke="#be123c" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function BathroomIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M6 14H22v5a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4v-5Z" stroke="#1e293b" strokeWidth="1.25" />
      <path d="M6 14V8a2 2 0 0 1 2-2h2" stroke="#1e293b" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="10" cy="5" r="1.5" stroke="#1e293b" strokeWidth="1.25" />
      <path d="M22 14v2" stroke="#be123c" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function DeckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M4 18h20" stroke="#1e293b" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M7 18V10M11 18V10M15 18V10M19 18V10" stroke="#1e293b" strokeWidth="1" strokeLinecap="round" />
      <path d="M4 10h20" stroke="#1e293b" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M4 22h20" stroke="#1e293b" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M7 10V6l4-2 4 2v4" stroke="#be123c" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const SERVICE_ICONS = {
  kitchens: <KitchenIcon />,
  bathrooms: <BathroomIcon />,
  decks: <DeckIcon />,
} as const;

const SERVICE_PATHS = {
  kitchens: '/remodelacion-cocinas',
  bathrooms: '/remodelacion-banos',
  decks: '/construccion-decks',
} as const;

// ─── Página ───────────────────────────────────────────────────────────────────

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const featuredProject = getFeaturedProject(locale);

  const serviceKeys = ['kitchens', 'bathrooms', 'decks'] as const;

  return (
    <>
      {/* ════════ SECCIÓN 1: VIDEO HERO CINEMATIC ════════════════════════════ */}
      <VideoHero locale={locale} dict={dict.hero} />

      {/* ════════ SECCIÓN 2: SERVICIOS ══════════════════════════════════════ */}
      <section aria-labelledby="services-heading" className="bg-brand-cream py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <span className="accent-line mb-6" aria-hidden="true" />
            <h2
              id="services-heading"
              className="font-playfair text-3xl lg:text-4xl font-semibold text-slate-900"
            >
              {dict.services.heading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200/60 rounded-sm overflow-hidden shadow-luxury">
            {serviceKeys.map((key) => {
              const service = dict.services[key];
              return (
                <article
                  key={key}
                  className="group bg-brand-cream p-8 lg:p-10 flex flex-col gap-6 relative"
                >
                  <div className="flex-shrink-0">{SERVICE_ICONS[key]}</div>
                  <div className="flex flex-col gap-3 flex-1">
                    <h3 className="font-playfair text-xl font-semibold text-slate-900 leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-inter">
                      {service.description}
                    </p>
                    <p className="text-xs text-slate-400 font-inter font-medium">
                      {dict.services.typicalInvestment}{' '}
                      <span className="text-slate-600">{service.range}</span>
                    </p>
                  </div>
                  <Link
                    href={`/${locale}${SERVICE_PATHS[key]}`}
                    className="group/link flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors w-fit"
                  >
                    <span>{service.link}</span>
                    <span className="transition-transform duration-200 group-hover/link:translate-x-1" aria-hidden="true">→</span>
                  </Link>
                  <span
                    className="absolute bottom-0 left-0 right-0 h-px bg-rose-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                    aria-hidden="true"
                  />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ SECCIÓN 3: CASO DE ESTUDIO ═══════════════════════════════ */}
      <section aria-labelledby="portfolio-heading" className="bg-brand-cream pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <span className="accent-line mb-6" aria-hidden="true" />
            <h2
              id="portfolio-heading"
              className="font-playfair text-3xl lg:text-4xl font-semibold text-slate-900"
            >
              {dict.portfolio.heading}
            </h2>
            <p className="mt-3 text-slate-500 font-inter text-base max-w-lg">
              {dict.portfolio.subtext}
            </p>
          </div>
          <CaseStudyCard project={featuredProject} dict={dict.caseStudyCard} />
        </div>
      </section>

      {/* ════════ SECCIÓN 4: TESTIMONIOS ════════════════════════════════════ */}
      <section aria-labelledby="testimonials-heading" className="bg-brand-obsidian py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <span className="block w-8 h-px bg-rose-600 mb-6" aria-hidden="true" />
            <h2
              id="testimonials-heading"
              className="font-playfair text-3xl lg:text-4xl font-semibold text-white"
            >
              {dict.testimonials.heading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 rounded-sm overflow-hidden">
            {dict.testimonials.items.map((t, i) => (
              <blockquote key={i} className="bg-brand-obsidian p-8 lg:p-10 flex flex-col gap-6">
                <span className="font-playfair text-5xl text-rose-700 leading-none select-none" aria-hidden="true">
                  &ldquo;
                </span>
                <p className="text-slate-300 text-sm leading-relaxed font-inter flex-1">{t.quote}</p>
                <footer className="flex flex-col gap-1 border-t border-white/10 pt-5">
                  <cite className="not-italic text-sm font-semibold text-white font-inter">{t.author}</cite>
                  <span className="text-xs text-slate-500 font-inter">{t.location}</span>
                  <span className="text-xs text-rose-700 font-medium font-inter mt-1">{t.project}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SECCIÓN 5: RISK REVERSAL ══════════════════════════════════ */}
      <RiskReversal dict={dict.riskReversal} />

      {/* ════════ SECCIÓN 6: CTA FINAL ══════════════════════════════════════ */}
      <section className="bg-brand-obsidian py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="block w-8 h-px bg-rose-600 mx-auto mb-8" aria-hidden="true" />
          <h2 className="font-playfair text-4xl lg:text-5xl font-semibold text-white mb-6 leading-tight">
            {dict.cta.title}
            <br />
            <span className="text-slate-400">{dict.cta.titleAccent}</span>
          </h2>
          <p className="text-slate-400 font-inter text-base max-w-lg mx-auto mb-12 leading-relaxed">
            {dict.cta.description}
          </p>
          <Link
            href={`/${locale}/evaluacion-proyecto`}
            className="inline-flex items-center gap-3 px-10 py-4 bg-brand-cream text-slate-900 text-sm font-semibold rounded-sm hover:bg-white transition-colors duration-200"
          >
            {dict.cta.button}
            <span aria-hidden="true">→</span>
          </Link>
          <p className="mt-6 text-xs text-slate-600 font-inter">{dict.cta.pricingNote}</p>
        </div>
      </section>
    </>
  );
}
