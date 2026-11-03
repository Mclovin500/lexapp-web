import type { TipoPerfil } from '../types/perfil.types'

export interface OpcionPerfil {
  tipo: TipoPerfil
  icon: string
  title: string
  tag: string
  /** Resalta la tarjeta con el color primario (perfil principal de la plataforma web). */
  destacada: boolean
  description: string
  features: string[]
  platformNote: {
    icon: string
    label: string
  }
  continueLabel: string
  nextStepHint: string
}

export const seleccionPerfilContent = {
  header: {
    backToHome: 'Volver al inicio',
    brandName: 'LexApp',
    brandBadge: 'OS',
    brandSubtitle: 'LEGAL SUITE',
    // PLACEHOLDER: validar antes de publicar
    securityBadge: 'Acceso protegido TLS 1.3',
    // PLACEHOLDER: validar antes de publicar
    systemVersion: 'v4.2.0',
  },
  intro: {
    stepTag: 'Paso previo • Selección de rol',
    title: 'Únete a LexApp',
    subtitle:
      'Para comenzar, selecciona el tipo de cuenta que deseas utilizar dentro del ecosistema judicial y legal.',
    legend: 'Tipo de cuenta',
  },
  perfilPorDefecto: 'abogado' as TipoPerfil,
  opciones: [
    {
      tipo: 'cliente',
      icon: 'person_search',
      title: 'Soy Cliente',
      tag: 'Persona / Pyme',
      destacada: false,
      description:
        'Busco asesoría legal especializada, quiero encontrar abogados certificados y dar seguimiento transparente a mis asuntos jurídicos.',
      features: [
        'Búsqueda y cotización por especialidad legal',
        'Seguimiento procesal móvil en tiempo real',
        'Cifrado de grado bancario y confidencialidad',
      ],
      platformNote: {
        icon: 'stay_current_portrait',
        label: 'Acceso optimizado para app móvil',
      },
      continueLabel: 'Continuar como Cliente',
      nextStepHint: 'Información y enlace de descarga de la aplicación móvil',
    },
    {
      tipo: 'abogado',
      icon: 'gavel',
      title: 'Soy Abogado',
      tag: 'Litigante • Firma',
      destacada: true,
      description:
        'Quiero ofrecer mis servicios profesionales, gestionar clientes corporativos y centralizar mis expedientes jurídicos y honorarios.',
      features: [
        'Plataforma web integral y despacho digital',
        'Validación de cédula profesional ante DGP',
        'Gestión documental, plazos y cobro de honorarios',
      ],
      platformNote: {
        icon: 'laptop_mac',
        label: 'Suite web completa para litigio',
      },
      continueLabel: 'Continuar como Abogado',
      nextStepHint: 'Registro oficial de cédula y datos profesionales',
    },
  ] satisfies OpcionPerfil[],
  action: {
    nextStepPrefix: 'Siguiente paso:',
  },
  links: {
    hasAccountText: '¿Ya tienes una cuenta registrada en LexApp?',
    loginLinkText: 'Inicia sesión',
  },
  footer: {
    // PLACEHOLDER: validar antes de publicar
    securityLabel: 'Conexión cifrada TLS 1.3 • Protocolo de secreto fiduciario NOM-151',
    get legal() {
      return `Tus datos están protegidos y resguardados conforme a la LFPDPPP • © ${new Date().getFullYear()} LexApp Systems México.`
    },
  },
}
