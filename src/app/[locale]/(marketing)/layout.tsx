// ─────────────────────────────────────────────────────────────────────────────
// [locale] Marketing Layout — Server Component
// Inyecta Nav, Footer y WhatsAppFloatingButton con dict del servidor.
// <main> sin pt-16 — el VideoHero escala al pixel 0 bajo el Nav de cristal.
// ─────────────────────────────────────────────────────────────────────────────

import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import WhatsAppFloatingButton from '@/components/layout/WhatsAppFloatingButton';
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
    <div className="flex flex-col min-h-screen">
      {/*
        Nav es Client Component — recibe locale y labels como props.
        El Server Component es el único autorizado para llamar getDictionary().
        Nav es fixed/z-50 — flota sobre el canvas sin empujar el contenido.
      */}
      <Nav locale={locale as Locale} labels={dict.navigation} />

      {/*
        Sin pt-16: el VideoHero arranca en top:0 y se desliza
        orgánicamente detrás del Nav de cristal (composición Z-Axis correcta).
        Los silos tienen su propio py-32 que compensa el header fijo.
      */}
      <main className="flex-grow">
        {children}
      </main>

      <Footer dict={dict.footer} locale={locale} />

      {/* Client island aislado — no contamina el Server Layout */}
      <WhatsAppFloatingButton dict={dict.whatsapp} />
    </div>
  );
}
