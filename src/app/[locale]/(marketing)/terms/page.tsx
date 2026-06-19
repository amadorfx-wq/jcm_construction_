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
      ? 'Términos y Condiciones | JC Milian Construction'
      : 'Terms & Conditions | JC Milian Construction',
    description: isEs
      ? 'Términos y Condiciones de JC Milian Construction. Conozca las reglas de uso de nuestros servicios.'
      : 'Terms & Conditions for JC Milian Construction. Learn the rules for using our services.',
    robots: {
      index: false, // Keep off public organic indexes, direct review URL only
      follow: true,
    },
  };
}

export default async function TermsPage({
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
          Términos y Condiciones
        </h1>
        <p className="text-sm text-slate-400 font-inter mb-8">
          Última actualización: 19 de junio de 2026
        </p>

        <div className="font-inter text-slate-700 leading-relaxed space-y-6 text-sm">
          <p>
            Bienvenido a <strong>JC Milian Construction</strong>. Al acceder a nuestro sitio web y utilizar nuestros servicios, usted acepta estar sujeto a los siguientes Términos y Condiciones. Por favor, léalos detenidamente.
          </p>

          <h2 className="font-playfair text-xl font-semibold text-slate-900 pt-4">
            1. Servicios prestados
          </h2>
          <p>
            JC Milian Construction ofrece servicios de arquitectura, remodelación y construcción residencial de alta gama en el área metropolitana de Atlanta, GA. El uso de este sitio web es para proporcionar información sobre nuestras especialidades y permitirle solicitar estimaciones.
          </p>

          <h2 className="font-playfair text-xl font-semibold text-slate-900 pt-4">
            2. Solicitudes de Estimación
          </h2>
          <p>
            Al enviar una solicitud de estimación gratuita a través de nuestro formulario, usted acepta proporcionar información precisa y verídica. JC Milian Construction responderá a las solicitudes legítimas según la disponibilidad de la agenda de nuestro equipo.
          </p>

          <h2 className="font-playfair text-xl font-semibold text-slate-900 pt-4">
            3. Términos de la Mensajería SMS / Texto
          </h2>
          <div className="bg-slate-50 border-l-2 border-rose-600 p-4 space-y-3">
            <p>
              Al proporcionar su número de teléfono y aceptar el envío de mensajes de texto en nuestro formulario, usted acepta recibir comunicaciones de mensajería SMS de <strong>JC Milian Construction</strong>.
            </p>
            <p>
              Las comunicaciones incluyen seguimiento de presupuestos de remodelación, recordatorios de visitas de inspección y actualizaciones del estado de su proyecto.
            </p>
            <p>
              La aceptación y consentimiento para recibir mensajes de texto (SMS) no es una condición de compra de ningún bien o servicio. La frecuencia de los mensajes varía. Pueden aplicar tarifas de mensajes y datos por parte de su proveedor de red.
            </p>
            <p>
              Usted puede cancelar su suscripción a los mensajes de texto en cualquier momento respondiendo <strong>STOP</strong> a cualquier mensaje que reciba. Para obtener ayuda o soporte, puede responder <strong>HELP</strong> o contactarnos directamente por correo electrónico.
            </p>
            <p className="font-semibold text-slate-950">
              La información de consentimiento y el opt-in para mensajes móviles NO se compartirán con ni se venderán a terceros o afiliados con fines de marketing.
            </p>
          </div>

          <h2 className="font-playfair text-xl font-semibold text-slate-900 pt-4">
            4. Limitación de responsabilidad
          </h2>
          <p>
            Los materiales y descripciones de servicios en este sitio web se proporcionan "tal cual". JC Milian Construction no garantiza la precisión del contenido publicitario fuera del presupuesto final firmado bajo contrato vinculante.
          </p>

          <h2 className="font-playfair text-xl font-semibold text-slate-900 pt-4">
            5. Ley aplicable
          </h2>
          <p>
            Estos términos se rigen e interpretan de acuerdo con las leyes del Estado de Georgia, EE. UU., sin dar efecto a ningún principio de conflictos de leyes.
          </p>

          <h2 className="font-playfair text-xl font-semibold text-slate-900 pt-4">
            6. Contacto
          </h2>
          <p>
            Si tiene alguna duda sobre estos Términos, puede escribirnos a:
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
        Terms & Conditions
      </h1>
      <p className="text-sm text-slate-400 font-inter mb-8">
        Last updated: June 19, 2026
      </p>

      <div className="font-inter text-slate-700 leading-relaxed space-y-6 text-sm">
        <p>
          Welcome to <strong>JC Milian Construction</strong>. By accessing our website and using our services, you agree to be bound by the following Terms & Conditions. Please read them carefully.
        </p>

        <h2 className="font-playfair text-xl font-semibold text-slate-900 pt-4">
          1. Services Provided
        </h2>
        <p>
          JC Milian Construction provides high-end residential architectural, remodeling, and construction services in the Atlanta, GA metropolitan area. Use of this website is for informational purposes and to request estimates.
        </p>

        <h2 className="font-playfair text-xl font-semibold text-slate-900 pt-4">
          2. Estimate Requests
        </h2>
        <p>
          By submitting a free estimate request through our form, you agree to provide accurate and truthful information. JC Milian Construction will respond to legitimate requests subject to availability.
        </p>

        <h2 className="font-playfair text-xl font-semibold text-slate-900 pt-4">
          3. SMS / Messaging Terms
        </h2>
        <div className="bg-slate-50 border-l-2 border-rose-600 p-4 space-y-3">
          <p>
            By providing your phone number and opting in on our form, you agree to receive SMS messaging communications from <strong>JC Milian Construction</strong>.
          </p>
          <p>
            SMS communications include estimate follow-ups, appointment reminders, and project status updates.
          </p>
          <p>
            Consent to receive SMS messages is NOT a condition of any purchase. Message frequency varies. Message and data rates may apply from your mobile carrier.
          </p>
          <p>
            You can opt out of SMS communications at any time by replying <strong>STOP</strong> to any message you receive. For assistance, you can reply <strong>HELP</strong> or email us directly.
          </p>
          <p className="font-semibold text-slate-950">
            Mobile opt-in information and consent are NOT shared with or sold to third parties or affiliates for marketing purposes.
          </p>
        </div>

        <h2 className="font-playfair text-xl font-semibold text-slate-900 pt-4">
          4. Limitation of Liability
        </h2>
        <p>
          Website materials are provided "as is". JC Milian Construction does not warrant the accuracy of marketing content outside of the final contract budget signed by both parties.
        </p>

        <h2 className="font-playfair text-xl font-semibold text-slate-900 pt-4">
          5. Governing Law
        </h2>
        <p>
          These terms are governed by and construed in accordance with the laws of the State of Georgia, USA, without giving effect to any choice of law rules.
        </p>

        <h2 className="font-playfair text-xl font-semibold text-slate-900 pt-4">
          6. Contact Us
        </h2>
        <p>
          If you have questions about these Terms, you can contact us at:
          <br />
          Email: <a href="mailto:jcmilianconstruction@gmail.com" className="text-rose-700 underline font-medium">jcmilianconstruction@gmail.com</a>
        </p>
      </div>
    </main>
  );
}
