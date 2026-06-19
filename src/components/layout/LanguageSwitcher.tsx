'use client';

// ─────────────────────────────────────────────────────────────────────────────
// LanguageSwitcher — Client Component
// Navegación cruzada inteligente vía ROUTE_MAP inverso.
// NO hace swap simple de prefijo — resuelve el slug semánticamente equivalente
// en el idioma destino consultando el índice SLUG_TO_KEY de routes.ts.
// ─────────────────────────────────────────────────────────────────────────────

import { usePathname, useRouter } from 'next/navigation';
import { i18n, type Locale } from '@/i18n/config';
import { getOppositeLocaleHref } from '@/i18n/routes';

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router   = useRouter();

  const targetLocale = (
    i18n.locales.find((l) => l !== currentLocale) ?? i18n.defaultLocale
  ) as Locale;

  function switchLocale() {
    const targetHref = getOppositeLocaleHref(pathname, currentLocale, targetLocale);
    router.push(targetHref);
  }

  const label = targetLocale === 'es' ? 'ES' : 'EN';

  return (
    <button
      onClick={switchLocale}
      aria-label={`Switch to ${targetLocale === 'es' ? 'Spanish' : 'English'}`}
      className="text-xs font-medium font-inter text-slate-500 hover:text-slate-900 transition-colors duration-150 tracking-widest uppercase"
    >
      {label}
    </button>
  );
}
