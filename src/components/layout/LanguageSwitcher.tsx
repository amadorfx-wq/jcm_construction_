'use client';

// ─────────────────────────────────────────────────────────────────────────────
// LanguageSwitcher — Client Component
// Lee el pathname actual y navega al mismo path en el otro locale.
// Diseño: texto minimalista luxury, sin peso visual innecesario.
// ─────────────────────────────────────────────────────────────────────────────

import { usePathname, useRouter } from 'next/navigation';
import { i18n, type Locale } from '@/i18n/config';

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale() {
    const nextLocale = i18n.locales.find((l) => l !== currentLocale) ?? i18n.defaultLocale;

    // Reemplazar el segmento de locale en el pathname actual
    // "/en/remodelacion-cocinas" → "/es/remodelacion-cocinas"
    const segments = pathname.split('/');
    // segments[1] es el locale actual si el middleware ya lo ha prefijado
    if (i18n.locales.includes(segments[1] as Locale)) {
      segments[1] = nextLocale;
    } else {
      segments.splice(1, 0, nextLocale);
    }

    router.push(segments.join('/'));
  }

  const targetLocale = i18n.locales.find((l) => l !== currentLocale) ?? 'es';
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
