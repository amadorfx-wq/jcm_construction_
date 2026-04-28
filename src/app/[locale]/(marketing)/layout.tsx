// ─────────────────────────────────────────────────────────────────────────────
// [locale] Marketing Layout — Server Component
// Inyecta Nav con etiquetas traducidas del diccionario.
// Aplica a: homepage, silos de cocinas/baños/decks.
// ─────────────────────────────────────────────────────────────────────────────

import Nav from '@/components/layout/Nav';
import { getDictionary } from '@/i18n/getDictionary';
import type { Locale } from '@/i18n/config';

export default async function MarketingLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      {/*
        Nav es Client Component — recibe locale y labels como props.
        El Server Component es el único autorizado para llamar getDictionary().
      */}
      <Nav locale={locale as Locale} labels={dict.navigation} />

      {/* pt-0 → Video hero goes full-bleed behind the transparent Nav */}
      <main>
        {children}
      </main>
    </>
  );
}
