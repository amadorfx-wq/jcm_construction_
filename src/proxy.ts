// ─────────────────────────────────────────────────────────────────────────────
// proxy.ts — Edge Runtime · Guardián i18n + SEO de Slugs
//
// ⚠️  IMPORTANTE — Edge Runtime Constraint:
//     El Edge Runtime NO resuelve alias @/ de tsconfig.paths correctamente.
//     Todo el código de este archivo debe ser self-contained.
//     NO importar desde @/i18n/routes ni @/i18n/config.
//     Las constantes de ROUTE_MAP y SLUG_TO_KEY están duplicadas aquí por diseño.
//
// RESPONSABILIDADES (en orden de evaluación):
//   1. Redirección de raíz sin locale → /{detectedLocale}
//   2. Redirección 308 de slug incorrecto para el locale activo
//      (protege el crawl budget — ninguna URL errónea responde con 200)
//   3. Rewrite interno transparente de slug-ES → carpeta física-EN
//      (el usuario y Google ven /es/remodelacion-cocinas, App Router
//       sirve la carpeta /es/kitchen-remodeling sin cambiar la URL)
//
// CADENA DE EJECUCIÓN NEXT.JS APP ROUTER:
//   next.config.ts (headers) → [proxy.ts / middleware] → App Router
// ─────────────────────────────────────────────────────────────────────────────

import { type NextRequest, NextResponse } from 'next/server';

// ─── Constantes de locale ─────────────────────────────────────────────────────

const LOCALES        = ['en', 'es'] as const;
type  Locale         = (typeof LOCALES)[number];
const DEFAULT_LOCALE: Locale = 'en';
const LOCALE_COOKIE  = 'NEXT_LOCALE';

// ─── ROUTE_MAP inlineado (Edge Runtime no soporta alias @/) ──────────────────
// Clave semántica → slug por locale.
// El slug 'en' es la carpeta física real en el filesystem.
// El slug 'es' es lo que se expone al usuario/bot cuando locale='es'.

const ROUTE_MAP: Record<string, Record<Locale, string>> = {
  kitchens:  { en: 'kitchen-remodeling',  es: 'remodelacion-cocinas' },
  bathrooms: { en: 'bathroom-renovation', es: 'remodelacion-banos'   },
  decks:     { en: 'deck-construction',   es: 'construccion-decks'   },
  estimate:  { en: 'free-estimate',       es: 'evaluacion-proyecto'  },
};

// ─── Índice inverso inlineado: slug → clave semántica ────────────────────────

const SLUG_TO_KEY: Record<string, string> = Object.fromEntries(
  Object.entries(ROUTE_MAP).flatMap(([key, slugs]) =>
    Object.values(slugs).map((slug) => [slug, key])
  )
);

// ─── Helper: detectar locale desde cookies / Accept-Language ─────────────────

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

// ─── Matcher: sólo rutas de contenido ────────────────────────────────────────

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|woff2?|ttf|otf|eot)).*)',
  ],
};

// ─── Proxy principal ──────────────────────────────────────────────────────────

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // ── Paso 1: Redirección de raíz sin locale ────────────────────────────────
  // Si el pathname no empieza por un locale conocido, redirigir al locale
  // detectado. Preserva el pathname completo (útil para deep links directos).
  const hasLocalePrefix = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!hasLocalePrefix) {
    const locale    = detectLocale(request);
    const targetUrl = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(targetUrl);
  }

  // ── Paso 2: Extraer locale y slug ─────────────────────────────────────────
  const segments     = pathname.split('/').filter(Boolean);
  const locale       = segments[0] as Locale;
  const slug         = segments[1];

  // Home page o ruta sin slug de servicio → pass-through
  if (!slug) return NextResponse.next();

  // Slug no está en nuestro mapa → pass-through (rutas personalizadas, API, etc.)
  const semanticKey = SLUG_TO_KEY[slug];
  if (!semanticKey) return NextResponse.next();

  const slugMap      = ROUTE_MAP[semanticKey];
  const correctSlug  = slugMap[locale];    // slug correcto para este locale
  const physicalSlug = slugMap['en'];      // carpeta física (siempre en inglés)

  // ── Paso 3: Slug INCORRECTO para este locale → 308 Permanent Redirect ─────
  // Ejemplos:
  //   /en/remodelacion-cocinas → 308 → /en/kitchen-remodeling
  //   /es/kitchen-remodeling   → 308 → /es/remodelacion-cocinas
  //   /en/evaluacion-proyecto  → 308 → /en/free-estimate
  //   /es/free-estimate        → 308 → /es/evaluacion-proyecto
  //
  // Status 308 (no 301) porque preserva el método HTTP (GET, POST, etc.)
  // y es el recomendado por Google para redirects permanentes de contenido.
  if (slug !== correctSlug) {
    const redirectUrl    = request.nextUrl.clone();
    redirectUrl.pathname = `/${locale}/${correctSlug}`;
    return NextResponse.redirect(redirectUrl, { status: 308 });
  }

  // ── Paso 4: Slug correcto pero NO coincide con la carpeta física ───────────
  // Ocurre cuando locale='es': el slug correcto es 'remodelacion-cocinas'
  // pero la carpeta física del filesystem es 'kitchen-remodeling'.
  // Hacemos un rewrite interno — la URL visible NO cambia para usuario/bot.
  if (slug !== physicalSlug) {
    const rewriteUrl    = request.nextUrl.clone();
    rewriteUrl.pathname = `/${locale}/${physicalSlug}`;
    return NextResponse.rewrite(rewriteUrl);
  }

  // ── Paso 5: URL completamente correcta (locale en inglés, carpeta física) ──
  return NextResponse.next();
}
