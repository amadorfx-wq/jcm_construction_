// ─────────────────────────────────────────────────────────────────────────────
// Footer — Server Component puro
// Global, Mobile-First. Teléfono colosal como CTA principal de cierre.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { getLocalizedHref } from '@/i18n/routes';

interface FooterDict {
  tagline: string;
  phone: string;
  phoneHref: string;
  copyright: string;
  address: string;
  links: {
    kitchens: string;
    bathrooms: string;
    decks: string;
    estimate: string;
    privacy: string;
    terms: string;
  };
}

interface FooterProps {
  dict: FooterDict;
  locale: string;
}

export default function Footer({ dict, locale }: FooterProps) {
  const navLinks = [
    { label: dict.links.kitchens,  href: getLocalizedHref('kitchens',  locale) },
    { label: dict.links.bathrooms, href: getLocalizedHref('bathrooms', locale) },
    { label: dict.links.decks,     href: getLocalizedHref('decks',     locale) },
    { label: dict.links.estimate,  href: getLocalizedHref('estimate',  locale) },
    { label: dict.links.privacy,   href: `/${locale}/privacy-policy` },
    { label: dict.links.terms,     href: `/${locale}/terms` },
  ];

  return (
    <footer className="bg-brand-obsidian border-t border-white/10 py-12 px-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Bloque superior: Logo + Tagline + Teléfono colosal ───────────── */}
        <div className="flex flex-col items-center text-center gap-4 mb-10">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="font-playfair text-2xl font-semibold text-white tracking-tight hover:text-white/80 transition-colors"
            aria-label="JC Milian Construction — Inicio"
          >
            JC Milian
            <span className="text-rose-600 ml-0.5">.</span>
          </Link>

          {/* Tagline */}
          <p className="text-sm text-white/50 font-inter max-w-xs leading-relaxed">
            {dict.tagline}
          </p>

          {/* Teléfono — CTA colosal centrado para pulgar mobile */}
          <a
            href={dict.phoneHref}
            className={[
              'inline-flex items-center justify-center gap-2',
              'font-playfair text-3xl md:text-4xl font-semibold',
              'text-rose-500 hover:text-rose-400',
              'transition-colors duration-200',
              // Touch target amplio
              'py-3 px-2 min-h-[56px] w-full md:w-auto',
            ].join(' ')}
            aria-label={`Call JC Milian Construction: ${dict.phone}`}
          >
            {/* Ícono de teléfono SVG nativo */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="flex-shrink-0">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            {dict.phone}
          </a>
        </div>

        {/* ── Divisor ───────────────────────────────────────────────────────── */}
        <div className="w-full h-px bg-white/10 mb-8" />

        {/* ── Links de navegación ───────────────────────────────────────────── */}
        <nav
          aria-label="Footer navigation"
          className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8 mb-10"
        >
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={[
                'text-sm text-white/50 hover:text-white/80',
                'font-inter tracking-wide transition-colors duration-200',
                // Touch target mínimo en mobile
                'py-2 px-1 min-h-[44px] flex items-center',
              ].join(' ')}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* ── Copyright + Address ───────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-xs text-white/30 font-inter">{dict.address}</p>
          <p className="text-xs text-white/30 font-inter">{dict.copyright}</p>
        </div>

      </div>
    </footer>
  );
}
