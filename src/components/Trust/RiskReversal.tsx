// ─────────────────────────────────────────────────────────────────────────────
// RiskReversal — Server Component
// Recibe dict del Server Page (nunca llama getDictionary directamente).
// Íconos SVG inline — texto 100% desde props.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface GuaranteeDict {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  legalNote: string;
}

interface RiskReversalDict {
  heading: string;
  subheading: string;
  guarantees: readonly GuaranteeDict[];
}

interface RiskReversalProps {
  dict: RiskReversalDict;
}

// ─── Íconos SVG inline ────────────────────────────────────────────────────────

function ShieldIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 3L4 8v8c0 7.2 5.4 13.5 12 15 6.6-1.5 12-7.8 12-15V8L16 3Z"
        stroke="#1e293b" strokeWidth="1.25" strokeLinejoin="round"
      />
      <path
        d="M11 16.5l3 3 7-7"
        stroke="#be123c" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function CertificateIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="4" y="3" width="18" height="24" rx="1.5" stroke="#1e293b" strokeWidth="1.25" />
      <line x1="8"  y1="9"  x2="18" y2="9"  stroke="#1e293b" strokeWidth="1" strokeLinecap="round" />
      <line x1="8"  y1="13" x2="16" y2="13" stroke="#1e293b" strokeWidth="1" strokeLinecap="round" />
      <line x1="8"  y1="17" x2="18" y2="17" stroke="#1e293b" strokeWidth="1" strokeLinecap="round" />
      <circle cx="23" cy="23" r="6" stroke="#be123c" strokeWidth="1" />
      <path d="M20 23l2 2 4-4" stroke="#be123c" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="4" y="6" width="24" height="22" rx="1.5" stroke="#1e293b" strokeWidth="1.25" />
      <line x1="4" y1="13" x2="28" y2="13" stroke="#1e293b" strokeWidth="1" strokeLinecap="round" />
      <line x1="10" y1="3" x2="10" y2="9"  stroke="#1e293b" strokeWidth="1.25" strokeLinecap="round" />
      <line x1="22" y1="3" x2="22" y2="9"  stroke="#1e293b" strokeWidth="1.25" strokeLinecap="round" />
      <rect x="18" y="17" width="6" height="6" rx="1" stroke="#be123c" strokeWidth="1" />
    </svg>
  );
}

// El orden de íconos corresponde al orden de garantías en el diccionario
const GUARANTEE_ICONS = [
  <ShieldIcon key="shield" />,
  <CertificateIcon key="cert" />,
  <CalendarIcon key="cal" />,
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function RiskReversal({ dict }: RiskReversalProps) {
  return (
    <section aria-labelledby="risk-reversal-heading" className="bg-brand-cream">

      <div className="max-w-6xl mx-auto px-6 pt-20 pb-12">
        <span className="accent-line mb-6" aria-hidden="true" />
        <h2
          id="risk-reversal-heading"
          className="font-playfair text-3xl lg:text-4xl font-semibold text-slate-900 max-w-lg leading-tight"
        >
          {dict.heading}
        </h2>
        <p className="mt-4 text-slate-500 text-base max-w-xl leading-relaxed font-inter">
          {dict.subheading}
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200/60 rounded-sm overflow-hidden shadow-luxury">
          {dict.guarantees.map((guarantee, index) => (
            <article
              key={guarantee.id}
              className="bg-brand-cream p-8 lg:p-10 flex flex-col gap-5"
            >
              <div className="flex-shrink-0">{GUARANTEE_ICONS[index]}</div>

              <div className="flex flex-col gap-1.5">
                <h3 className="font-playfair text-xl font-semibold text-slate-900 leading-snug">
                  {guarantee.title}
                </h3>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-medium font-inter">
                  {guarantee.subtitle}
                </p>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed font-inter flex-1">
                {guarantee.body}
              </p>

              <p className="text-[11px] text-slate-400 italic font-inter border-t border-slate-100 pt-5 leading-snug">
                {guarantee.legalNote}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
