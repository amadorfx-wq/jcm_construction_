// ─────────────────────────────────────────────────────────────────────────────
// [locale] Evaluación Proyecto — Layout de Conversión (Server Component)
// Blindaje de embudo: SIN Nav. Solo logo (escape controlado) + teléfono real.
// robots: noindex — funnel fuera del índice de Google.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free Estimate | JC Milian Construction',
  description: 'Get your free remodeling estimate. JC Milian Construction — Atlanta, GA. A specialist will contact you in 15 minutes.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function EvaluacionLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return (
    <>
      {/* Header ultra-minimalista: logo + teléfono real, cero distracciones */}
      <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-[#0a0a0c] flex items-center">
        <div className="max-w-6xl mx-auto w-full px-6 flex items-center justify-between">

          {/* Logo — único punto de escape controlado */}
          <Link
            href={`/${locale}`}
            className="font-playfair text-lg font-semibold text-white tracking-tight hover:text-gray-200 transition-colors"
            aria-label="JC Milian Construction — Volver al inicio"
          >
            JC Milian
            <span className="text-rose-600 ml-0.5">.</span>
          </Link>

          {/* Teléfono real — touch target amplio para cierre mobile */}
          <a
            href="tel:+16785081879"
            className={[
              'inline-flex items-center gap-2',
              'text-sm font-medium text-gray-300 hover:text-white',
              'transition-colors font-inter tracking-wide',
              // Touch target mínimo recomendado por Apple HIG
              'min-h-[44px] px-4 -mr-4',
            ].join(' ')}
            aria-label="Call JC Milian Construction: +1 (678) 508-1879"
          >
            {/* Ícono de teléfono SVG nativo */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            +1 (678) 508-1879
          </a>
        </div>
      </header>

      {/* Contenido desplazado 80px por el header fijo */}
      <div className="pt-20 min-h-screen bg-[#FAFAFB]">
        {children}
      </div>
    </>
  );
}
