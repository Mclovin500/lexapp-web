export const codigoRecuperacionContent = {
  back: 'Volver a ingresar correo',
  // PLACEHOLDER: validar antes de publicar (identificador de operación de ejemplo)
  operationId: 'ID: REC-NOM151-8492',
  title: 'Introduce el código de recuperación',
  description: 'Enviamos un código de un solo uso a tu correo electrónico.',
  destinationLabel: 'Destino de recuperación',
  codeLabel: 'Código de verificación (6 dígitos)',
  submitButton: 'Verificar código y continuar',
  links: {
    wrongEmail: '¿El correo no es correcto? Regresar',
    rememberedPassword: '¿Recordaste tu contraseña? Iniciar sesión',
  },
  trustSeal: 'El código es temporal y de un solo uso',
  trustReference: 'Nunca compartas este código con nadie.',
  errors: {
    codigo_incorrecto: 'Código incorrecto. Verifica e inténtalo de nuevo.',
    codigo_vencido: 'El código venció. Solicita uno nuevo.',
    demasiados_intentos: 'Demasiados intentos. Inténtalo más tarde.',
    red: 'No pudimos conectar con el servidor. Inténtalo de nuevo.',
    desconocido: 'Ocurrió un error inesperado. Inténtalo de nuevo.',
  },
}
