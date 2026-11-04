export const recuperarContrasenaContent = {
  title: 'Recuperar contraseña',
  description:
    'Introduce el correo electrónico profesional asociado a tu cuenta de LexApp. Te enviaremos un código para restablecer tu acceso.',
  privacy: {
    title: 'Reserva de confidencialidad',
    // PLACEHOLDER: validar antes de publicar
    text: 'Por protección de tus datos conforme a la LFPDPPP, no revelaremos si la dirección se encuentra registrada en nuestros sistemas.',
  },
  form: {
    emailLabel: 'Correo electrónico profesional',
    emailPlaceholder: 'ejemplo@despacho.com',
    submitButton: 'Enviar código de recuperación',
    submittingButton: 'Enviando…',
  },
  links: {
    rememberedText: '¿Recordaste tus credenciales?',
    loginLinkText: 'Volver al inicio de sesión',
  },
  trustBadges: [
    { icon: 'lock_clock', title: 'Código temporal', detail: 'De un solo uso' },
    // PLACEHOLDER: validar antes de publicar
    { icon: 'policy', title: 'NOM-151', detail: 'Trazabilidad oficial' },
    // PLACEHOLDER: validar antes de publicar
    { icon: 'encrypted', title: 'End-to-End', detail: 'Criptografía cuántica' },
  ],
  errors: {
    datos_invalidos: 'Revisa el correo ingresado e inténtalo de nuevo.',
    demasiados_intentos: 'Demasiadas solicitudes. Inténtalo más tarde.',
    red: 'No pudimos conectar con el servidor. Inténtalo de nuevo.',
    desconocido: 'Ocurrió un error inesperado. Inténtalo de nuevo.',
  },
}
