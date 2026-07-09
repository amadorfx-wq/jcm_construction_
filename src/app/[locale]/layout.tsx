// ─────────────────────────────────────────────────────────────────────────────
// [locale] Root Layout — Server Component
// Raíz real de la app: html lang dinámico, fuentes, metadata base.
// generateStaticParams → pre-renderiza en/es en build-time.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { i18n } from '@/i18n/config';
import '../globals.css';

// ─── Fuentes ──────────────────────────────────────────────────────────────────

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'block',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'optional',
});

// ─── Static Params — genera rutas para cada locale en build-time ──────────────

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

// ─── Metadata base ────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL('https://jcmilianconstruction.com'),
  title: {
    default: 'JC Milian Construction — Premium Remodeling in Atlanta, GA',
    template: '%s | JC Milian Construction',
  },
  description:
    'High-end kitchen, bathroom, and deck remodeling in Atlanta, GA. 15+ years of experience, 2-year workmanship warranty, and guaranteed final price.',
  keywords: [
    'kitchen remodeling Atlanta',
    'bathroom renovation Atlanta',
    'deck construction Atlanta',
    'luxury home remodeling Georgia',
    'JC Milian Construction',
  ],
  authors: [{ name: 'JC Milian Construction' }],
  openGraph: {
    type: 'website',
    siteName: 'JC Milian Construction',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-brand-cream text-slate-900 font-inter antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
