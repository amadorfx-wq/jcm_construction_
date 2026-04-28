'use client';

// ─────────────────────────────────────────────────────────────────────────────
// Nav — Client Component
// Recibe locale + labels del Server Layout (nunca llama getDictionary directamente).
// Construye hrefs dinámicamente con prefijo de locale.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface NavLabels {
  kitchens: string;
  bathrooms: string;
  decks: string;
  evaluate: string;
  callUs: string;
}

interface NavProps {
  locale: Locale;
  labels: NavLabels;
}

// ─── Íconos ───────────────────────────────────────────────────────────────────

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="3" y1="6"  x2="19" y2="6"  />
      <line x1="3" y1="11" x2="19" y2="11" />
      <line x1="3" y1="16" x2="19" y2="16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="4" y1="4" x2="18" y2="18" />
      <line x1="18" y1="4" x2="4"  y2="18" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Nav({ locale, labels }: NavProps) {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef               = useRef<HTMLDivElement>(null);

  // Links construidos dinámicamente con prefijo de locale
  const navLinks = [
    { label: labels.kitchens,  href: `/${locale}/remodelacion-cocinas` },
    { label: labels.bathrooms, href: `/${locale}/remodelacion-banos` },
    { label: labels.decks,     href: `/${locale}/construccion-decks` },
  ];

  const evaluateHref = `/${locale}/evaluacion-proyecto`;
  const homeHref     = `/${locale}`;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 h-16',
          'transition-all duration-500',
          scrolled
            ? 'bg-brand-cream/95 backdrop-blur-md shadow-luxury'
            : 'bg-transparent backdrop-blur-none shadow-none',
        ].join(' ')}
      >
        <nav
          className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <Link
            href={homeHref}
            className={`font-playfair text-lg font-semibold tracking-tight transition-colors duration-500 ${scrolled ? 'text-slate-900 hover:text-slate-700' : 'text-white hover:text-white/80'}`}
            aria-label="JC Milian Construction — Home"
          >
            JC Milian
            <span className="text-rose-700 ml-0.5">.</span>
          </Link>

          {/* ── Desktop links ─────────────────────────────────────────────── */}
          <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`text-sm transition-colors duration-500 font-inter tracking-wide ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/70 hover:text-white'}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Desktop CTA + LanguageSwitcher + Mobile hamburger ─────────── */}
          <div className="flex items-center gap-4">
            <Link
              href={evaluateHref}
              className={[
                'hidden md:inline-flex items-center gap-2',
                'text-sm font-medium rounded px-5 py-2',
                'transition-all duration-500',
                scrolled
                  ? 'text-slate-800 border border-slate-900/20 hover:border-slate-900/60 hover:bg-slate-900/[0.03]'
                  : 'text-white/90 border border-white/25 hover:border-white/50 hover:bg-white/10',
              ].join(' ')}
            >
              {labels.evaluate}
            </Link>

            <div className="hidden md:block">
              <LanguageSwitcher currentLocale={locale} />
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className={`md:hidden flex items-center justify-center w-10 h-10 rounded transition-colors duration-500 ${scrolled ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile menu overlay ──────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className="fixed inset-0 z-40 flex flex-col bg-brand-cream pt-16"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <nav className="flex flex-col px-6 pt-8 gap-1">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-playfair font-medium text-slate-900 py-4 border-b border-slate-100 hover:text-rose-700 transition-colors"
              >
                {label}
              </Link>
            ))}

            <Link
              href={evaluateHref}
              onClick={() => setMobileOpen(false)}
              className={[
                'mt-8 inline-flex items-center justify-center',
                'text-base font-medium text-white bg-slate-900',
                'rounded px-6 py-3.5',
                'hover:bg-slate-800 transition-colors',
              ].join(' ')}
            >
              {labels.evaluate}
            </Link>
          </nav>

          <div className="mt-auto px-6 pb-10 flex items-end justify-between">
            <div>
              <p className="text-xs text-slate-400 font-inter mb-1 uppercase tracking-widest">
                {labels.callUs}
              </p>
              <a
                href="tel:+14045550000"
                className="text-xl font-playfair text-slate-900 hover:text-rose-700 transition-colors"
              >
                (404) 555-0000
              </a>
            </div>
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </div>
      )}
    </>
  );
}
