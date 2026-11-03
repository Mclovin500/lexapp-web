import type { IdReglaContrasena } from '../schemas/registro.schema'

export const registroContent = {
  brandName: 'LexApp',
  title: 'Crea tu cuenta profesional',
  subtitle: 'Paso inicial para habilitar tu despacho digital y colegiación en la plataforma.',
  /** Etapas visibles del registro: A3 (datos básicos), A4 (credenciales), A5 (área de práctica). */
  steps: {
    ariaLabel: 'Progreso del registro',
    items: ['Datos básicos', 'Credenciales', 'Área de práctica'],
    status: {
      current: 'En curso',
      pending: 'Pendiente',
      done: 'Completado',
    },
    counter: (actual: number, total: number) => `Paso ${actual} de ${total}`,
  },
  form: {
    firstNameLabel: 'Nombre(s)',
    firstNamePlaceholder: 'Ej. Alejandro',
    lastNameLabel: 'Apellidos',
    lastNamePlaceholder: 'Ej. Morales Vega',
    emailLabel: 'Correo electrónico profesional',
    emailPlaceholder: 'alejandro.morales@despacho.com',
    phoneLabel: 'Teléfono',
    phoneOptional: '(opcional)',
    phonePlaceholder: 'Ej. 55 1234 5678',
    passwordLabel: 'Contraseña maestra',
    confirmPasswordLabel: 'Confirmar contraseña',
    passwordPlaceholder: '••••••••••••',
    submitButton: 'Siguiente: verificar correo',
    submittingButton: 'Creando cuenta…',
  },
  passwordMeter: {
    title: 'Requisitos mínimos de seguridad jurídica:',
    strength: ['Débil', 'Débil', 'Aceptable', 'Segura'],
  },
  passwordRules: {
    longitud: '8+ caracteres',
    mayuscula: 'Mayúscula',
    numero: 'Al menos 1 número',
  } satisfies Record<IdReglaContrasena, string>,
  terms: {
    // PLACEHOLDER: validar antes de publicar y asignar rutas a los documentos legales
    prefix: 'Acepto las ',
    serviceTerms: 'Condiciones de Servicio',
    middle: ', el ',
    confidentiality: 'Tratamiento Confidencial de Expedientes',
    suffix: ' y el acuerdo de secreto profesional RGPD aplicable.',
  },
  errors: {
    correo_registrado: 'Ya existe una cuenta con este correo. Inicia sesión o usa otro correo.',
    datos_invalidos: 'Revisa los datos ingresados e inténtalo de nuevo.',
    demasiados_intentos: 'Demasiados intentos. Inténtalo de nuevo más tarde.',
    red: 'No pudimos conectar con el servidor. Inténtalo de nuevo.',
    desconocido: 'Ocurrió un error inesperado. Inténtalo de nuevo.',
  },
  reassurance: 'Cifrado E2E para expedientes y validez procesal',
  links: {
    hasAccountText: '¿Ya tienes una cuenta colegiada?',
    loginLinkText: 'Iniciar sesión',
  },
}
