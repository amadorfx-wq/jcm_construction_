// ─────────────────────────────────────────────────────────────────────────────
// i18n Config — Motor de Tipos
// Fuente de verdad única para locales. Importar desde aquí, nunca hardcodear.
// ─────────────────────────────────────────────────────────────────────────────

export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'es'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
