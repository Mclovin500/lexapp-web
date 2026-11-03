import type { EnlaceTienda } from '../types/app-movil.types'

/** Lee una variable de entorno y la trata como ausente si está vacía. */
function leerUrl(valor: string | undefined): string | undefined {
  const limpio = valor?.trim()
  return limpio ? limpio : undefined
}

export const appMovilContent = {
  header: {
    backToProfileSelection: 'Volver a selección de perfil',
    brandName: 'LexApp',
    brandBadge: 'Legal OS',
    brandSubtitle: 'Plataforma de Gestión Jurídica Digital',
    // PLACEHOLDER: validar antes de publicar
    securityBadge: 'Acceso protegido TLS 1.3',
    // PLACEHOLDER: validar antes de publicar
    systemVersion: 'v4.2.0',
  },
  intro: {
    tag: 'Experiencia móvil para clientes',
    title: 'LexApp para Clientes está disponible en la App Móvil',
    lead: 'Para gestionar tus trámites, comunicarte con tu abogado y dar seguimiento a tus casos en tiempo real, descarga nuestra aplicación oficial.',
    description:
      'Disfruta de una experiencia diseñada exclusivamente para simplificar la consulta de expedientes judiciales, recibir notificaciones procesales al instante y mantener una línea fiduciaria directa y protegida.',
  },
  benefits: [
    {
      icon: 'notifications_active',
      title: 'Notificaciones Instantáneas',
      description: 'Alertas de acuerdos judiciales y términos procesales en tiempo real.',
    },
    {
      icon: 'chat_bubble',
      title: 'Chat Fiduciario Cifrado',
      description: 'Canal confidencial punto a punto con tu abogado titular asignado.',
    },
    {
      icon: 'folder_zip',
      title: 'Bóveda Digital Portátil',
      description: 'Expedientes, resoluciones y contratos resguardados en tu bolsillo.',
    },
  ],
  stores: {
    heading: 'Enlaces oficiales de instalación',
    unavailableLabel: 'Próximamente',
    links: [
      {
        tienda: 'google-play',
        url: leerUrl(import.meta.env.VITE_URL_GOOGLE_PLAY),
        caption: 'Disponible en',
        name: 'Google Play',
        title: 'Descargar LexApp Clientes para Android',
      },
      {
        tienda: 'app-store',
        url: leerUrl(import.meta.env.VITE_URL_APP_STORE),
        caption: 'Consíguelo en el',
        name: 'App Store',
        title: 'Descargar LexApp Clientes para iOS',
      },
    ] satisfies EnlaceTienda[],
  },
  trust: {
    title: 'LexApp facilita la comunicación y organización de tus servicios jurídicos.',
    // PLACEHOLDER: validar antes de publicar
    description:
      'Cifrado fiduciario de grado bancario • Protección integral de datos personales conforme a los lineamientos de la LFPDPPP y secreto profesional garantizado.',
  },
  /** Datos ilustrativos de la maqueta del teléfono (no son datos reales). */
  mockup: {
    srDescription:
      'Vista previa de la app móvil de LexApp para clientes: seguimiento del caso, abogado asignado y próximas audiencias.',
    notification: {
      tag: 'Nueva Notificación',
      time: 'Hace 4m',
      title: 'Se admitió prueba testimonial',
      detail: 'Juzgado 14º de lo Civil • Exp. 402/2024',
    },
    secureChannel: 'Canal Seguro Verificado',
    statusTime: '09:41',
    client: {
      greeting: 'Bienvenido',
      name: 'Carlos Mendoza',
      initials: 'CM',
    },
    activeCase: {
      status: 'En proceso',
      docket: 'Exp. 402/2024',
      title: 'Juicio Ordinario Mercantil',
      court: 'Juzgado Décimo Cuarto de lo Civil CDMX',
      progressLabel: 'Fase procesal actual',
      progressPercentage: 65,
      stage: 'Contestación de demanda completada',
    },
    lawyer: {
      label: 'Abogado Titular Asignado',
      availability: 'Disponible',
      name: 'Lic. Alejandro Morales G.',
      initials: 'AM',
      role: 'Socio Litigante Senior',
      messageAction: 'Mensaje',
      callAction: 'Llamada',
    },
    nextEvent: {
      title: 'Audiencia Preliminar',
      detail: 'En 3 días • Sala 4 Oralidad',
      time: '11:30 AM',
    },
    tabs: [
      { icon: 'home', label: 'Inicio', active: true, badge: false },
      { icon: 'folder_open', label: 'Casos', active: false, badge: false },
      { icon: 'chat_bubble', label: 'Chat', active: false, badge: true },
      { icon: 'person', label: 'Perfil', active: false, badge: false },
    ],
  },
  footer: {
    get copyright() {
      return `© ${new Date().getFullYear()} LexApp Technologies Inc. Todos los derechos reservados.`
    },
    // PLACEHOLDER: asignar rutas cuando existan estas páginas
    links: [
      { label: 'Aviso de Privacidad', href: undefined as string | undefined },
      { label: 'Términos de Servicio para Clientes', href: undefined as string | undefined },
      { label: 'Soporte Técnico Especializado', href: undefined as string | undefined },
    ],
  },
}
