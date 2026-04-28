// ─────────────────────────────────────────────────────────────────────────────
// [locale] Evaluación Proyecto — Layout de Conversión (Server Component)
// Blindaje de embudo: SIN Nav. Solo logo (escape controlado) + teléfono.
// robots: noindex — funnel fuera del índice de Google.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Evaluación de Proyecto | JC Milian Construction',
  description: 'Solicita tu evaluación estructural de proyecto. JC Milian Construction — Atlanta, GA.',
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
      {/* Header ultra-minimalista: logo + teléfono, cero distracciones */}
      <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-[#0a0a0c] flex items-center">
        <div className="max-w-6xl mx-auto w-full px-6 flex items-center justify-between">

          {/* Logo — único punto de escape, controlado */}
          <Link
            href={`/${locale}`}
            className="font-playfair text-lg font-semibold text-white tracking-tight hover:text-gray-200 transition-colors"
            aria-label="JC Milian Construction — Volver al inicio"
          >
            JC Milian
            <span className="text-rose-600 ml-0.5">.</span>
          </Link>

          {/* Teléfono — CTA de cierre para prospectos que prefieren llamar */}
          <a
            href="tel:+14045550000"
            className="text-sm text-gray-300 hover:text-white transition-colors font-inter tracking-wide"
            aria-label="Llamar a JC Milian Construction"
          >
            (404) 555-0000
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
