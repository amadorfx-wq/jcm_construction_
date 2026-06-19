// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE NOTICE: This document is a template and should be reviewed by a
// licensed attorney before relying on it.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs
      ? 'Política de Privacidad | JC Milian Construction'
      : 'Privacy Policy | JC Milian Construction',
    description: isEs
      ? 'Política de Privacidad de JC Milian Construction. Conozca cómo protegemos su información.'
      : 'Privacy Policy for JC Milian Construction. Learn how we protect your information.',
    robots: {
      index: false, // Reviewers use direct URL, keep off public organic indexes
      follow: true,
    },
  };
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEs = locale === 'es';

  if (isEs) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-32">
        <h1 className="font-playfair text-4xl font-semibold text-slate-900 mb-2">
          Política de Privacidad
        </h1>
        <p className="text-sm text-slate-400 font-inter mb-8">
          Última actualización: 19 de junio de 2026
        </p>

        <div className="font-inter text-slate-700 leading-relaxed space-y-6 text-sm">
          <p>
            En <strong>JC Milian Construction</strong>, valoramos su privacidad y nos comprometemos a proteger sus datos personales. Esta Política de Privacidad describe cómo recopilamos, utilizamos y compartimos su información cuando visita nuestro sitio web y utiliza nuestros servicios.
          </p>

          <h2 className="font-playfair text-xl font-semibold text-slate-900 pt-4">
            1. Información que recopilamos
          </h2>
          <p>
            Recopilamos la información que usted nos proporciona directamente a través de nuestro formulario de estimación gratuita, incluyendo:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Nombre completo</li>
            <li>Número de teléfono</li>
            <li>Dirección de correo electrónico (opcional)</li>
            <li>Detalles y preferencias del proyecto de construcción o remodelación</li>
          </ul>

          <h2 className="font-playfair text-xl font-semibold text-slate-900 pt-4">
            2. Uso de la información
          </h2>
          <p>
            Utilizamos la información recopilada para procesar su solicitud de presupuesto, comunicarnos con usted sobre su proyecto, enviarle recordatorios y coordinar consultas de estimación.
          </p>

          <h2 className="font-playfair text-xl font-semibold text-slate-900 pt-4">
            3. Comunicaciones por Mensajería de Texto (SMS)
          </h2>
          <div className="bg-slate-50 border-l-2 border-rose-600 p-4 space-y-3">
            <p>
              <strong>JC Milian Construction</strong> envía mensajes de texto (SMS) para dar seguimiento a las solicitudes de presupuesto, enviar recordatorios de citas y proporcionar actualizaciones del proyecto.
            </p>
            <p>
              El consentimiento para recibir mensajes de texto (SMS) no es una condición para ninguna compra. La frecuencia de los mensajes varía. Pueden aplicar tarifas de mensajes y datos.
            </p>
            <p>
              Usted puede cancelar su suscripción a los mensajes SMS en cualquier momento respondiendo <strong>STOP</strong> a cualquier mensaje que reciba. Para obtener ayuda, puede responder <strong>HELP</strong>.
            </p>
            <p className="font-semibold text-slate-950">
              Uso compartido de información: La información de registro de suscripción móvil (opt-in) y el consentimiento NO se compartirán con ni se venderán a terceros o afiliados con fines de marketing.
            </p>
          </div>

          <h2 className="font-playfair text-xl font-semibold text-slate-900 pt-4">
            4. Seguridad de los datos
          </h2>
          <p>
            Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra el acceso no autorizado, alteración o destrucción.
          </p>

          <h2 className="font-playfair text-xl font-semibold text-slate-900 pt-4">
            5. Contacto
          </h2>
          <p>
            Si tiene alguna pregunta sobre esta Política de Privacidad, puede contactarnos en:
            <br />
            Email: <a href="mailto:jcmilianconstruction@gmail.com" className="text-rose-700 underline font-medium">jcmilianconstruction@gmail.com</a>
          </p>
        </div>
      </main>
    );
  }

  // English Version
  return (
    <main className="max-w-3xl mx-auto px-6 py-32">
      <h1 className="font-playfair text-4xl font-semibold text-slate-900 mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-slate-400 font-inter mb-8">
        Last updated: June 19, 2026
      </p>

      <div className="font-inter text-slate-700 leading-relaxed space-y-6 text-sm">
        <p>
          At <strong>JC Milian Construction</strong>, we value your privacy and are committed to protecting your personal data. This Privacy Policy describes how we collect, use, and share your information when you visit our website and use our services.
        </p>

        <h2 className="font-playfair text-xl font-semibold text-slate-900 pt-4">
          1. Information We Collect
        </h2>
        <p>
          We collect information that you directly provide to us through our free estimate form, including:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Full name</li>
          <li>Phone number</li>
          <li>Email address (optional)</li>
          <li>Details and preferences regarding your construction or remodeling project</li>
        </ul>

        <h2 className="font-playfair text-xl font-semibold text-slate-900 pt-4">
          2. How We Use Your Information
        </h2>
        <p>
          We use the information collected to process your estimate request, communicate with you regarding your project, send you reminders, and coordinate consultation visits.
        </p>

        <h2 className="font-playfair text-xl font-semibold text-slate-900 pt-4">
          3. SMS / Text Messaging
        </h2>
        <div className="bg-slate-50 border-l-2 border-rose-600 p-4 space-y-3">
          <p>
            <strong>JC Milian Construction</strong> sends text messages (SMS) to follow up on estimate requests, send appointment reminders, and provide project updates.
          </p>
          <p>
            Consent to receive SMS messages is NOT a condition of any purchase. Message frequency varies. Message and data rates may apply.
          </p>
          <p>
            You can opt out of SMS communications at any time by replying <strong>STOP</strong> to any message you receive. For assistance, you can reply <strong>HELP</strong>.
          </p>
          <p className="font-semibold text-slate-950">
            Information Sharing: Mobile opt-in information and consent are NOT shared with or sold to third parties or affiliates for marketing purposes.
          </p>
        </div>

        <h2 className="font-playfair text-xl font-semibold text-slate-900 pt-4">
          4. Data Security
        </h2>
        <p>
          We implement technical and organizational security measures to protect your personal information against unauthorized access, alteration, or destruction.
        </p>

        <h2 className="font-playfair text-xl font-semibold text-slate-900 pt-4">
          5. Contact Us
        </h2>
        <p>
          If you have questions about this Privacy Policy, you can reach us at:
          <br />
          Email: <a href="mailto:jcmilianconstruction@gmail.com" className="text-rose-700 underline font-medium">jcmilianconstruction@gmail.com</a>
        </p>
      </div>
    </main>
  );
}
