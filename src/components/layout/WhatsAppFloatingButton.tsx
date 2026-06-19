'use client';

// ─────────────────────────────────────────────────────────────────────────────
// WhatsAppFloatingButton — Client Component
// Botón flotante omnicanal. Safe-area iOS. Mobile-first touch target.
// ─────────────────────────────────────────────────────────────────────────────

interface WhatsAppProps {
  dict: {
    ariaLabel: string;
    prefilledMessage?: string;
  };
}

const WA_BASE = 'https://wa.me/16782650585';

export default function WhatsAppFloatingButton({ dict }: WhatsAppProps) {
  const href = dict.prefilledMessage
    ? `${WA_BASE}?text=${encodeURIComponent(dict.prefilledMessage)}`
    : WA_BASE;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={dict.ariaLabel}
      className={[
        // Posición — safe-area iOS: bottom-8 en mobile para sobrevivir la barra de Safari
        'fixed bottom-8 right-5 md:bottom-6 md:right-6 z-50',
        // Touch target mínimo 64x64 en mobile, 56x56 en desktop
        'w-16 h-16 md:w-14 md:h-14',
        // Forma y color WhatsApp oficial
        'flex items-center justify-center rounded-full',
        'bg-[#25D366] hover:bg-[#1DA851]',
        'text-white',
        // Sombra y escala
        'shadow-[0_8px_30px_rgba(37,211,102,0.35)]',
        'hover:scale-110 active:scale-95',
        'transition-all duration-300 ease-out',
      ].join(' ')}
    >
      {/* SVG nativo WhatsApp — sin dependencias externas */}
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        width="28"
        height="28"
        aria-hidden="true"
      >
        <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.48-8.45zM12.045 21.785h-.005c-1.775 0-3.514-.477-5.031-1.378l-.361-.214-3.741.975.998-3.648-.235-.374c-.99-1.574-1.512-3.393-1.511-5.26.002-5.45 4.437-9.884 9.893-9.884 2.64.001 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.887-9.888 9.891zm5.421-7.403c-.297-.149-1.758-.867-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.345.222-.643.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
      </svg>
    </a>
  );
}
