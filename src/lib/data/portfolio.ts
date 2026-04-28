import type { PortfolioProject, ProjectCategory } from '@/types';

const PORTFOLIO_PROJECTS: readonly PortfolioProject[] = [
  // ── Kitchen Hernández ───────────────────────────────────────────────────────
  {
    id: 'kitchen-hernandez-2024',
    slug: 'cocina-hernandez-2024',
    category: 'cocina',
    location: 'Buckhead, Atlanta GA',
    durationWeeks: 9,
    investmentRange: {
      minCents: 5200000,
      maxCents: 6800000,
    },
    content: {
      en: {
        title: 'Hernández Kitchen — Full Renovation',
        description:
          '1990s kitchen with dark laminate cabinets, cracked tile countertops, and discontinued appliances. The workflow was inefficient and storage space was insufficient for a family of 5.',
        highlights: [
          'Calacatta quartz kitchen island with waterfall edge',
          'Shaker cabinets in antique white with champagne hardware',
          'Sub-Zero and Wolf appliances integrated to panel',
          'Under-cabinet LED 2700K lighting + crystal pendants',
          '24×24" rectified porcelain tile in herringbone pattern',
        ],
      },
      es: {
        title: 'Renovación Integral Cocina Hernández',
        description:
          'Cocina de los años 90 con gabinetes laminados oscuros, encimera de azulejo roto y electrodomésticos descontinuados. El flujo de trabajo era ineficiente y el espacio de almacenamiento, insuficiente para una familia de 5.',
        highlights: [
          'Islas de cocina de cuarzo Calacatta con waterfall edge',
          'Gabinetes Shaker en blanco roto con herrajes champagne',
          'Electrodomésticos Sub-Zero y Wolf integrados al panel',
          'Iluminación bajo-gabinete LED 2700K + pendentes de cristal',
          'Piso de porcelanato 24×24" rectificado en espiga',
        ],
      },
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1200&auto=format&fit=crop',
        alt: 'Hernández Kitchen — original state before remodel',
        isCover: false,
        role: 'before',
      },
      {
        url: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?q=80&w=1200&auto=format&fit=crop',
        alt: 'Hernández Kitchen — final result with Calacatta quartz island',
        isCover: true,
        role: 'after',
      },
      {
        url: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?q=80&w=1200&auto=format&fit=crop',
        alt: 'Detail of champagne hardware and Shaker cabinets',
        isCover: false,
        role: 'gallery',
      },
    ],
    featured: true,
    completedAt: '2024-08-15',
  },

  // ── Bathroom Williams ───────────────────────────────────────────────────────
  {
    id: 'bathroom-williams-2024',
    slug: 'bano-williams-2024',
    category: 'bano',
    location: 'Sandy Springs, Atlanta GA',
    durationWeeks: 5,
    investmentRange: {
      minCents: 2800000,
      maxCents: 3800000,
    },
    content: {
      en: {
        title: 'Williams Master Bathroom — Residential Spa',
        description:
          '1980s master bathroom with peach garden tub, 4×4" brown tiles, and dark wood vanity with aged bronze mirror. Inadequate ventilation caused chronic humidity damage.',
        highlights: [
          '60"×36" walk-in shower with built-in niche and floating bench',
          'Double floating walnut vanity with Bianco Carrara marble top',
          'Matte black Kohler Artifacts fixtures at all points',
          'Radiant floor heating under porcelain tile',
          '12" recessed rain shower with thermostatic valve',
        ],
      },
      es: {
        title: 'Baño Principal Williams — Spa Residencial',
        description:
          'Baño principal de los años 80 con bañera de jardín en color melocotón, azulejos de 4×4" en marrón y vanidad en madera oscura con espejo de bronce envejecido. Sin ventilación adecuada causaba humedad crónica.',
        highlights: [
          'Ducha walk-in de 60"×36" con nicho empotrado y banco flotante',
          'Vanidad doble flotante en nogal americano con encimera de mármol Bianco Carrara',
          'Griferías matte black Kohler Artifacts en todos los puntos',
          'Calefacción radiante bajo el piso de porcelanato',
          'Ducha lluvia empotrada de 12" con válvula termostática',
        ],
      },
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1200&auto=format&fit=crop',
        alt: 'Williams Bathroom — original state with 1980s tub and tiles',
        isCover: false,
        role: 'before',
      },
      {
        url: 'https://images.unsplash.com/photo-1620626011761-996317702782?q=80&w=1200&auto=format&fit=crop',
        alt: 'Williams Bathroom — residential spa with walk-in shower and floating vanity',
        isCover: true,
        role: 'after',
      },
      {
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop',
        alt: 'Detail of matte black fixtures and Bianco Carrara marble top',
        isCover: false,
        role: 'gallery',
      },
    ],
    featured: false,
    completedAt: '2024-05-20',
  },

  // ── Deck Johnson ────────────────────────────────────────────────────────────
  {
    id: 'deck-johnson-2024',
    slug: 'deck-johnson-2024',
    category: 'deck',
    location: 'Alpharetta, Atlanta GA',
    durationWeeks: 6,
    investmentRange: {
      minCents: 3500000,
      maxCents: 4800000,
    },
    content: {
      en: {
        title: 'Johnson Exterior Deck — Outdoor Living Extension',
        description:
          '12-year-old treated pine deck with rotted boards, unstable railings, and no covered area. Unprotected sun exposure limited use to only a few weeks a year in Atlanta\'s climate.',
        highlights: [
          'Trex Transcend Lineage boards — 25-year rot warranty',
          'Cedar pergola with UV-resistant polycarbonate roof',
          'Aluminum railings with composite wood handrail cap',
          'Recessed LED deck lighting and illuminated post caps',
          '480 sq ft of usable area with distinct dining and lounge zones',
        ],
      },
      es: {
        title: 'Deck Exterior Johnson — Extensión de Vida al Aire Libre',
        description:
          'Deck de madera de pino tratado de 12 años de antigüedad con tablones podridos, barandales inestables y sin área cubierta. La exposición sin protección solar limitaba el uso a pocas semanas al año en el clima de Atlanta.',
        highlights: [
          'Tablones Trex Transcend Lineage — garantía de 25 años contra pudrición',
          'Pérgola con vigas de cedro y techo de policarbonato UV-resistente',
          'Barandales de aluminio con pasamanos de madera compuesta',
          'Iluminación LED de deck empotrada y postes de barandal iluminados',
          '480 sq ft de superficie útil con zona de comedor y lounge diferenciadas',
        ],
      },
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
        alt: 'Johnson Deck — original state with deteriorated wood and no coverage',
        isCover: false,
        role: 'before',
      },
      {
        url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1200&auto=format&fit=crop',
        alt: 'Johnson Deck — final result with Trex Transcend and cedar pergola',
        isCover: true,
        role: 'after',
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop',
        alt: 'Detail of recessed LED lighting and lounge zone',
        isCover: false,
        role: 'gallery',
      },
    ],
    featured: false,
    completedAt: '2024-10-03',
  },
] as const;

// ─── Helper — extrae contenido localizado de un proyecto ──────────────────────

type SupportedLocale = 'en' | 'es';

function resolveContent(project: PortfolioProject, locale: string) {
  const loc: SupportedLocale = locale === 'es' ? 'es' : 'en';
  return {
    ...project,
    title: project.content[loc].title,
    description: project.content[loc].description,
    highlights: project.content[loc].highlights,
  };
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export function getFeaturedProject(locale = 'en') {
  const featured = PORTFOLIO_PROJECTS.find((p) => p.featured);
  if (!featured) {
    throw new Error(
      '[portfolio.ts] getFeaturedProject(): No featured project found. ' +
        'Mark at least one project with featured: true.'
    );
  }
  return resolveContent(featured, locale);
}

export function getProjectBySlug(slug: string, locale = 'en') {
  const project = PORTFOLIO_PROJECTS.find((p) => p.slug === slug);
  if (!project) {
    throw new Error(`[portfolio.ts] getProjectBySlug(): No project found with slug "${slug}".`);
  }
  return resolveContent(project, locale);
}

export function getProjectsByType(category: ProjectCategory, locale = 'en') {
  return PORTFOLIO_PROJECTS.filter((p) => p.category === category).map((p) =>
    resolveContent(p, locale)
  );
}

export function getAllProjects(locale = 'en') {
  return PORTFOLIO_PROJECTS.map((p) => resolveContent(p, locale));
}
