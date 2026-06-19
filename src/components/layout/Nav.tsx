'use client';

// ─────────────────────────────────────────────────────────────────────────────
// Nav — Client Component
// Recibe locale + labels del Server Layout (nunca llama getDictionary directamente).
// Teléfono real integrado. Mobile-First: CTA de llamada agresivo en menú móvil.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { getLocalizedHref } from '@/i18n/routes';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface NavLabels {
  kitchens: string;
  bathrooms: string;
  decks: string;
  evaluate: string;
  callUs: string;
  phoneDisplay: string;
  phoneHref: string;
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

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Nav({ locale, labels }: NavProps) {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef               = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: labels.kitchens,  href: getLocalizedHref('kitchens',  locale) },
    { label: labels.bathrooms, href: getLocalizedHref('bathrooms', locale) },
    { label: labels.decks,     href: getLocalizedHref('decks',     locale) },
  ];

  const evaluateHref = getLocalizedHref('estimate', locale);
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

          {/* ── Desktop: Teléfono + CTA + LanguageSwitcher + Hamburger ───── */}
          <div className="flex items-center gap-3">

            {/* Teléfono desktop — luz tenue en scrolled, sutil en transparente */}
            <a
              href={labels.phoneHref}
              className={[
                'hidden md:inline-flex items-center gap-1.5',
                'text-sm font-medium font-inter rounded-md px-2.5 py-1.5',
                'transition-all duration-500',
                scrolled
                  ? [
                      'text-slate-600 hover:text-slate-900',
                      'bg-rose-50/70 hover:bg-rose-50',
                      'shadow-[0_0_14px_rgba(190,18,60,0.09),inset_0_0_8px_rgba(190,18,60,0.04)]',
                      'hover:shadow-[0_0_20px_rgba(190,18,60,0.14),inset_0_0_10px_rgba(190,18,60,0.06)]',
                    ].join(' ')
                  : 'text-white/50 hover:text-white/90 bg-transparent',
              ].join(' ')}
              aria-label={`Call us: ${labels.phoneDisplay}`}
            >
              <PhoneIcon />
              {labels.phoneDisplay}
            </a>

            {/* CTA button — halo rose en scrolled, cristal en transparente */}
            <Link
              href={evaluateHref}
              className={[
                'hidden md:inline-flex items-center gap-2',
                'text-sm font-medium rounded px-5 py-2',
                'transition-all duration-500',
                scrolled
                  ? [
                      'text-slate-800',
                      'border border-rose-200/70 hover:border-rose-300/90',
                      'bg-gradient-to-br from-rose-50/60 via-white/40 to-rose-50/30',
                      'hover:from-rose-50/90 hover:via-white/60 hover:to-rose-50/50',
                      'shadow-[0_0_22px_rgba(190,18,60,0.11),0_1px_3px_rgba(190,18,60,0.06)]',
                      'hover:shadow-[0_0_32px_rgba(190,18,60,0.18),0_2px_6px_rgba(190,18,60,0.08)]',
                    ].join(' ')
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

          {/* ── CTA de llamada — protagonista absoluto del menú móvil ─────── */}
          <div className="mt-auto px-6 pb-10 flex flex-col gap-4">

            {/* Etiqueta */}
            <p className="text-xs text-slate-400 font-inter uppercase tracking-widest text-center">
              {labels.callUs}
            </p>

            {/* Teléfono colosal — w-full, touch target máximo */}
            <a
              href={labels.phoneHref}
              className={[
                'w-full flex items-center justify-center gap-3',
                'min-h-[64px] rounded-sm',
                'bg-rose-50 border border-rose-200',
                'font-playfair text-2xl font-semibold text-rose-600',
                'hover:bg-rose-100 hover:text-rose-700',
                'transition-colors duration-200',
              ].join(' ')}
              aria-label={`Call JC Milian: ${labels.phoneDisplay}`}
            >
              <PhoneIcon />
              {labels.phoneDisplay}
            </a>

            <div className="flex justify-center">
              <LanguageSwitcher currentLocale={locale} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
