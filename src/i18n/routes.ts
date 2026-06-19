// ─────────────────────────────────────────────────────────────────────────────
// routes.ts — Fuente de verdad única para slugs localizados.
// Importar getLocalizedHref() en Nav, Footer, VideoHero y páginas de silos.
// NUNCA hardcodear slugs de ruta en los componentes.
//
// Arquitectura:
//   - ROUTE_MAP: clave semántica → slug por locale
//   - SLUG_TO_KEY: índice inverso slug → clave semántica (para LanguageSwitcher)
//   - getLocalizedHref: genera la URL correcta para un locale dado
//   - getOppositeLocaleHref: resuelve la URL equivalente en el otro idioma
// ─────────────────────────────────────────────────────────────────────────────

import type { Locale } from './config';

// ─── Mapa canónico ────────────────────────────────────────────────────────────
// Las carpetas físicas del filesystem usan el slug en inglés (clave 'en').
// El slug en español es lo que se expone al usuario/bot cuando locale='es'.

export const ROUTE_MAP = {
  kitchens: {
    en: 'remodelacion-cocinas',
    es: 'remodelacion-cocinas',
  },
  bathrooms: {
    en: 'remodelacion-banos',
    es: 'remodelacion-banos',
  },
  decks: {
    en: 'construccion-decks',
    es: 'construccion-decks',
  },
  estimate: {
    en: 'evaluacion-proyecto',
    es: 'evaluacion-proyecto',
  },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof ROUTE_MAP;

// ─── Índice inverso: slug → clave semántica ───────────────────────────────────
// Permite al LanguageSwitcher encontrar la clave semántica dada una URL
// arbitraria, sin iterar el mapa en cada render.

export const SLUG_TO_KEY: Record<string, RouteKey> = Object.fromEntries(
  (Object.entries(ROUTE_MAP) as [RouteKey, Record<Locale, string>][]).flatMap(
    ([key, slugs]) =>
      (Object.values(slugs) as string[]).map((slug) => [slug, key])
  )
);

// ─── Helper: URL canónica para un locale dado ─────────────────────────────────
// Uso: getLocalizedHref('kitchens', locale) → '/en/kitchen-remodeling' | '/es/remodelacion-cocinas'

export function getLocalizedHref(key: RouteKey, locale: string): string {
  const slugs = ROUTE_MAP[key];
  const slug =
    (locale as Locale) in slugs ? slugs[locale as Locale] : slugs.en;
  return `/${locale}/${slug}`;
}

// ─── Helper: URL equivalente en el locale opuesto ─────────────────────────────
// Usado exclusivamente por LanguageSwitcher para navegación cruzada inteligente.
// NO hace swap simple de prefijo — resuelve el slug correcto vía SLUG_TO_KEY.
//
// Ejemplo:
//   pathname='/en/kitchen-remodeling', currentLocale='en', targetLocale='es'
//   → '/es/remodelacion-cocinas'

export function getOppositeLocaleHref(
  currentPathname: string,
  currentLocale: Locale,
  targetLocale: Locale
): string {
  // Segmentos: ['', 'en', 'kitchen-remodeling'] → slug = 'kitchen-remodeling'
  const segments = currentPathname.split('/').filter(Boolean);
  const slug = segments[1]; // segments[0] es siempre el locale

  // Home page u otras rutas sin slug mapeado
  if (!slug) return `/${targetLocale}`;

  const key = SLUG_TO_KEY[slug];
  if (!key) {
    // Ruta no mapeada (p.ej. una subruta personalizada) — swap simple de locale
    return `/${targetLocale}/${segments.slice(1).join('/')}`;
  }

  return getLocalizedHref(key, targetLocale);
}
