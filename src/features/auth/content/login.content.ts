export const loginContent = {
  header: {
    backToHome: 'Volver al inicio',
    // PLACEHOLDER: validar antes de publicar
    systemVersion: 'SISTEMA OPERATIVO v4.2',
    brandName: 'LexApp',
    brandSubtitle: 'LEGAL SUITE',
  },
  welcome: {
    title: 'Bienvenido de nuevo',
    subtitle: 'Inicia sesión para continuar utilizando LexApp en tu entorno jurídico.',
  },
  lawyerBanner: {
    icon: 'verified_user',
    prefix: 'Acceso directo a la plataforma web ',
    highlight: 'LexApp Suite',
    suffix: ' para abogados y asesores colegiados.',
  },
  form: {
    emailLabel: 'Correo electrónico profesional',
    emailPlaceholder: 'licenciado@despacho.com',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: '••••••••••••',
    forgotPassword: '¿Olvidaste tu contraseña?',
    rememberDevice: 'Recordar este equipo por 30 días',
    submitButton: 'Iniciar sesión',
    submittingButton: 'Iniciando sesión…',
    showPasswordAriaLabel: 'Mostrar contraseña',
    hidePasswordAriaLabel: 'Ocultar contraseña',
  },
  errors: {
    credenciales: 'Correo o contraseña incorrectos.',
    cuentaNoAbogadoPrefix: 'Esta plataforma es exclusiva para abogados. Si eres cliente, ',
    cuentaNoAbogadoLinkText: 'usa la app móvil',
    cuentaNoAbogadoSuffix: '.',
    demasiadosIntentos: 'Demasiados intentos. Inténtalo de nuevo más tarde.',
    red: 'No pudimos conectar con el servidor. Inténtalo de nuevo.',
    desconocido: 'Ocurrió un error inesperado. Inténtalo de nuevo.',
  },
  links: {
    noAccountText: '¿No tienes una cuenta colegiada?',
    registerLinkText: 'Regístrate en LexApp',
    isClientText: '¿Eres cliente?',
    mobileAppLinkText: 'Usa la app móvil de LexApp',
  },
  footer: {
    // PLACEHOLDER: validar antes de publicar
    securityLabel: 'Conexión cifrada TLS 1.3 • Protocolo de secreto fiduciario NOM-151',
    get copyright() {
      return `LexApp Technologies Inc. © ${new Date().getFullYear()}. Todos los derechos reservados.`
    },
  },
  institutionalPanel: {
    tag: 'PLATAFORMA INTEGRAL DE SERVICIOS JURÍDICOS',
    title: 'Tu práctica jurídica, organizada con rigor milimétrico.',
    description:
      'Administra solicitudes procesales, cartera de clientes, convenios y expedientes judiciales mediante una infraestructura segura creada para despachos de alto impacto.',
    cards: {
      activeCase: {
        // PLACEHOLDER: validar antes de publicar
        docketNumber: 'Expediente 402/2024-CIV',
        court: 'Juzgado Séptimo de Distrito en Materia Civil',
        // PLACEHOLDER: validar antes de publicar
        verificationBadge: 'Cotejado DGP',
        phaseLabel: 'Fase: Audiencia Constitucional',
        termLabel: 'Término en 48 hrs',
        progressPercentage: 72,
      },
      termAlert: {
        tag: 'Alerta de Términos',
        title: 'Auto de Admisión Notificado',
        description: 'Cédula electrónica recibida vía buzón judicial seguro.',
      },
      encryptedChannel: {
        tag: 'Canal Cifrado E2E',
        title: 'Bóveda de Evidencia Activa',
        // PLACEHOLDER: validar antes de publicar
        description: 'Metadatos con sello de tiempo criptográfico NOM-151.',
      },
    },
    metrics: [
      {
        // PLACEHOLDER: validar antes de publicar
        value: '+1,200',
        label: 'Asuntos gestionados',
        highlight: false,
      },
      {
        // PLACEHOLDER: validar antes de publicar
        value: '100%',
        label: 'Cifrado fiduciario',
        highlight: true,
      },
      {
        // PLACEHOLDER: validar antes de publicar
        value: 'DGP',
        label: 'Cotejo oficial de cédulas',
        highlight: false,
      },
    ],
  },
}

