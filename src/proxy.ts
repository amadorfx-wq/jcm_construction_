// ─────────────────────────────────────────────────────────────────────────────
// Proxy i18n — Edge Runtime
// Config inlineada: el Edge Runtime no resuelve alias @/ correctamente.
// ─────────────────────────────────────────────────────────────────────────────

import { type NextRequest, NextResponse } from 'next/server';

const LOCALES = ['en', 'es'] as const;
type Locale = (typeof LOCALES)[number];
const DEFAULT_LOCALE: Locale = 'en';
const LOCALE_COOKIE = 'NEXT_LOCALE';

function detectLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)) {
    return cookieLocale as Locale;
  }

  const acceptLanguage = request.headers.get('Accept-Language') ?? '';
  for (const part of acceptLanguage.split(',')) {
    const lang = part.trim().split(';')[0]?.trim().split('-')[0];
    if (lang && (LOCALES as readonly string[]).includes(lang)) {
      return lang as Locale;
    }
  }

  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (hasLocale) return NextResponse.next();

  const locale = detectLocale(request);
  const redirectUrl = new URL(`/${locale}${pathname}`, request.url);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ['/((?!_next|api|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|mp4|webm|mov)$).*)'],
};
