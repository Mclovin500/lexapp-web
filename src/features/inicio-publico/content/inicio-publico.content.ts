export interface NavItem {
  label: string
  href: string
}

export interface MetricItem {
  value: string
  label: string
  icon?: string
}

export interface StepItem {
  number: string
  icon: string
  title: string
  description: string
  footer: string
}

export interface BenefitItem {
  icon: string
  title: string
  description: string
}

export interface FeatureItem {
  icon: string
  title: string
  description: string
}

export interface SpecialistChip {
  icon: string
  label: string
}

export interface DeadlineItem {
  icon: string
  title: string
  subtitle: string
  tag: string
  variant: 'error' | 'secondary'
}

export const navItems: NavItem[] = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Para clientes', href: '#para-clientes' },
  { label: 'Para abogados', href: '#para-abogados' },
]

export const heroContent = {
  badge: 'Plataforma de Servicios Jurídicos Digitales',
  titlePart1: 'Los servicios legales,',
  titleHighlight: 'más cerca de ti',
  description:
    'Conecta con profesionales jurídicos y facilita la gestión de tus servicios legales mediante una plataforma digital diseñada para mejorar la comunicación, organización y seguimiento de tus asuntos.',
  primaryCta: 'Comenzar ahora',
  secondaryCta: 'Conoce cómo funciona',
  secondaryCtaHref: '#como-funciona',
  metrics: [
    {
      // PLACEHOLDER: validar antes de publicar
      value: '+1,200',
      label: 'Asuntos gestionados',
    },
    {
      icon: 'verified',
      // PLACEHOLDER: validar antes de publicar
      value: 'Cotejo DGP',
      label: 'Cédulas validadas',
    },
    {
      icon: 'lock',
      // PLACEHOLDER: validar antes de publicar
      value: 'NOM-151',
      label: 'Cifrado fiduciario',
    },
  ] satisfies MetricItem[],
  mockup: {
    url: 'lexapp.mx/expedientes/docket-84920',
    securityLabel: '256-bit AES',
    panelName: 'LexPanel',
    menuItems: [
      { icon: 'folder_special', label: 'Expedientes', active: true },
      { icon: 'gavel', label: 'Audiencias', active: false },
      { icon: 'contract', label: 'Contratos', active: false },
    ],
    docketCategory: 'Expediente Principal',
    docketTitle: 'Ordinario Mercantil 142/2025',
    docketStatus: 'Término Activo',
    progressTitle: 'Cronograma de Términos Judiciales',
    progressPhase: 'Fase 3 de 4',
    progressSteps: ['1. Demanda', '2. Contestación', '3. Desahogo', '4. Sentencia'],
    activeStepIndex: 2,
    recordTitle: 'Constancia de Notificación Digital',
    // PLACEHOLDER: validar antes de publicar
    recordSubtitle: 'Sello NOM-151-SCFI-2016 verificado',
    floatingCardTop: {
      icon: 'task_alt',
      title: 'Expediente Verificado',
      // PLACEHOLDER: validar antes de publicar
      subtitle: 'DGP: Cédula 7481920',
    },
    floatingCardBottom: {
      icon: 'enhanced_encryption',
      title: 'Comunicación Cifrada E2E',
      subtitle: 'Secreto profesional resguardado',
    },
  },
}

export const howItWorksContent = {
  badge: 'Proceso guiado',
  title: 'Una forma más sencilla de gestionar servicios jurídicos',
  description:
    'LexApp ofrece experiencias diferenciadas para clientes y abogados, adaptadas a las necesidades operativas de cada usuario.',
  steps: [
    {
      number: '01',
      icon: 'switch_account',
      title: 'Elige tu perfil',
      description:
        'Selecciona si necesitas contratar servicios jurídicos para resolver un caso o si eres un profesional del derecho listo para gestionar tu práctica.',
      footer: 'Cliente o Abogado',
    },
    {
      number: '02',
      icon: 'key',
      title: 'Accede a LexApp',
      description:
        'Ingresa a la experiencia correspondiente a tu tipo de cuenta mediante autenticación fiduciaria de doble factor y validación de identidad.',
      footer: 'Credenciales seguras',
    },
    {
      number: '03',
      icon: 'timeline',
      title: 'Gestiona tus servicios',
      description:
        'Facilita la comunicación directa, organización de pruebas y seguimiento continuo del estado procesal de tus asuntos jurídicos.',
      footer: 'Trazabilidad integral',
    },
  ] satisfies StepItem[],
}

export const forClientsContent = {
  badge: 'Experiencia para Clientes',
  badgeIcon: 'person',
  title: 'Encuentra apoyo legal cuando lo necesites',
  description:
    'LexApp para clientes ofrece herramientas para encontrar abogados, comunicarse con ellos y dar seguimiento a sus asuntos jurídicos desde la aplicación móvil.',
  benefits: [
    {
      icon: 'manage_search',
      title: 'Búsqueda por especialidad',
      description:
        'Encuentra profesionales acreditados en materias civil, mercantil, laboral, penal y corporativa.',
    },
    {
      icon: 'badge',
      title: 'Información profesional',
      description:
        'Revisa cédulas profesionales validadas ante DGP, trayectoria y experiencia comprobada.',
    },
    {
      icon: 'chat',
      title: 'Comunicación con el abogado',
      description:
        'Canal seguro para resolver consultas inmediatas y compartir antecedentes de tu caso con confidencialidad.',
    },
    {
      icon: 'update',
      title: 'Seguimiento de asuntos',
      description:
        'Monitorea el avance de tus solicitudes y etapas procesales con notificaciones en tiempo real.',
    },
  ] satisfies BenefitItem[],
  cta: {
    text: 'Conocer la experiencia para clientes',
    icon: 'smartphone',
  },
  phoneMockup: {
    time: '09:41',
    greeting: 'Bienvenido',
    userName: 'Carlos Mendoza',
    activeCaseNumber: 'Caso Activo #519',
    activeCaseStatus: 'En revisión',
    activeCaseTitle: 'Asesoría Laboral Corporativa',
    lawyerInitials: 'LR',
    lawyerName: 'Lic. Roberto Valdés',
    specialistsLabel: 'Especialistas Disponibles',
    specialists: [
      { icon: 'gavel', label: 'Mercantil' },
      { icon: 'work', label: 'Laboral' },
      { icon: 'domain', label: 'Fiscal' },
    ] satisfies SpecialistChip[],
    encryptedNotice: {
      icon: 'lock',
      title: 'Canal Cifrado Activo',
      subtitle: 'Sus consultas cuentan con secrecía legal',
    },
  },
}

export const forLawyersContent = {
  badge: 'Plataforma de Gestión Profesional',
  badgeIcon: 'gavel',
  title: 'Administra tu práctica jurídica desde un solo lugar',
  description:
    'LexApp proporciona herramientas digitales para organizar la actividad profesional de los abogados y facilitar la administración de sus servicios jurídicos.',
  benefits: [
    {
      icon: 'inbox',
      title: 'Gestión de solicitudes de clientes',
      description:
        'Recepción centralizada de consultas y nuevos asuntos con control previo de conflicto de interés.',
    },
    {
      icon: 'folder_copy',
      title: 'Organización de casos y expedientes',
      description:
        'Bóveda documental digital con trazabilidad y expedientes judiciales ordenados sistemáticamente.',
    },
    {
      icon: 'request_quote',
      title: 'Elaboración de propuestas de servicios',
      // PLACEHOLDER: validar antes de publicar
      description:
        'Cotizaciones transparentes con honorarios desglosados y constancia de validez jurídica NOM-151.',
    },
    {
      icon: 'calendar_month',
      title: 'Administración de citas y disponibilidad',
      description:
        'Control de agenda procesal, audiencias ante tribunales y citas de asesoría sincronizadas.',
    },
    {
      icon: 'mark_chat_read',
      title: 'Comunicación con clientes',
      description:
        'Mensajería fiduciaria cifrada y envío seguro de acuerdos judiciales con acuse de recibo.',
    },
  ] satisfies BenefitItem[],
  cta: {
    text: 'Regístrate como abogado',
  },
  mockup: {
    headerTitle: 'Despacho Jurídico Digital',
    statusText: 'En línea',
    metrics: [
      { value: '18', label: 'Expedientes activos' },
      { value: '3', label: 'Términos hoy', highlight: true },
    ],
    deadlinesTitle: 'Términos y Audiencias',
    deadlines: [
      {
        icon: 'alarm',
        title: 'Contestación de Demanda #392',
        subtitle: 'Juzgado Quinto Civil · Vence 14:00',
        tag: 'Urgente',
        variant: 'error',
      },
      {
        icon: 'event',
        title: 'Audiencia Preliminar Mercantil',
        subtitle: 'Tribunal Superior · 10:30 hrs',
        tag: 'Mañana',
        variant: 'secondary',
      },
    ] satisfies DeadlineItem[],
    proposal: {
      icon: 'fact_check',
      title: 'Propuesta de Honorarios #204',
      // PLACEHOLDER: validar antes de publicar
      subtitle: 'Aceptada y firmada con e.firma',
      amount: '$35,000',
    },
  },
}

export const featuresContent = {
  badge: 'Arquitectura Fiduciaria',
  title: 'Herramientas para una gestión jurídica más organizada',
  description:
    'Diseñadas bajo los más rigurosos estándares de seguridad de datos, secrecía profesional y estricto apego al marco normativo vigente.',
  features: [
    {
      icon: 'manage_search',
      title: 'Búsqueda de profesionales',
      description:
        'Directorio curado de abogados con validación oficial de cédulas ante la Dirección General de Profesiones y verificación de trayectoria procesal.',
    },
    {
      icon: 'assignment_turned_in',
      title: 'Gestión de solicitudes',
      description:
        'Recepción estructurada de requerimientos legales para una evaluación rápida de viabilidad técnica y determinación de honorarios transparentes.',
    },
    {
      icon: 'source',
      title: 'Organización de expedientes',
      description:
        'Control integral de autos, documentos de prueba y notificaciones judiciales en un solo entorno cifrado y accesible en cualquier momento.',
    },
    {
      icon: 'lock_clock',
      title: 'Comunicación digital',
      description:
        'Canal directo y protegido bajo secreto fiduciario con soporte para intercambio seguro de antecedentes documentales y acuerdos procesales.',
    },
    {
      icon: 'visibility',
      title: 'Seguimiento de asuntos',
      description:
        'Visibilidad permanente del estado de avance procesal para clientes y despachos, reduciendo la incertidumbre y garantizando certeza jurídica.',
    },
  ] satisfies FeatureItem[],
}

export const closingBannerContent = {
  title: '¿Listo para comenzar con LexApp?',
  description:
    'Únete a la plataforma que transforma la relación jurídica digital entre clientes y profesionales del derecho con seguridad, orden y transparencia.',
  loginCta: 'Iniciar sesión',
  registerCta: 'Comenzar ahora',
}

export const footerContent = {
  brandName: 'LexApp',
  brandSubtitle: 'LEGAL SUITE',
  description:
    'Plataforma digital diseñada para facilitar la conexión, gestión y seguimiento de servicios jurídicos entre clientes y abogados con máxima seguridad y transparencia.',
  navColumn: {
    title: 'Plataforma',
    links: [
      { label: 'Inicio', href: '#inicio' },
      { label: 'Cómo funciona', href: '#como-funciona' },
      { label: 'Para clientes', href: '#para-clientes' },
      { label: 'Para abogados', href: '#para-abogados' },
    ],
  },
  legalColumn: {
    title: 'Legal',
    // TODO: ruta cuando exista la página
    items: ['Aviso de privacidad', 'Términos y condiciones', 'Seguridad de datos'],
  },
  supportColumn: {
    title: 'Soporte',
    // TODO: ruta cuando exista la página
    items: ['Centro de ayuda', 'Contacto'],
  },
  copyright:
    '© 2025 LexApp Legal Suite. Plataforma de servicios jurídicos digitales en español. Todos los derechos reservados.',
  securityLabel: 'Cifrado y seguridad fiduciaria',
}

