export const nuevaContrasenaContent = {
  // PLACEHOLDER: validar antes de publicar
  codeValidated: 'Código validado',
  title: 'Crea una nueva contraseña',
  description: 'Tu código de recuperación fue comprobado. Establece una nueva contraseña para tu cuenta.',
  form: {
    passwordLabel: 'Nueva contraseña',
    passwordPlaceholder: 'Ingresa al menos 10 caracteres',
    confirmLabel: 'Confirmar contraseña',
    confirmPlaceholder: 'Repite tu nueva contraseña',
    matchPending: 'Sin verificar',
    matchOk: 'Las contraseñas coinciden',
    matchError: 'No coinciden',
    submitButton: 'Guardar nueva contraseña',
    submittingButton: 'Guardando…',
    // PLACEHOLDER: validar antes de publicar (depende de lo que haga el backend)
    revocationNote: 'Al guardar, se cerrarán las sesiones activas en otros dispositivos.',
  },
  criteria: {
    // PLACEHOLDER: validar antes de publicar
    title: 'Criterios de seguridad NOM-151',
    description: 'Tu nueva contraseña protege expedientes confidenciales. Debe cumplir:',
    // PLACEHOLDER: validar antes de publicar
    encryption: { title: 'Cifrado Asimétrico RSA-4096', detail: 'LexApp no puede leer tu contraseña.' },
    // PLACEHOLDER: validar antes de publicar
    compliance: 'Cumplimiento con Código de Comercio e ISO/IEC 27001',
  },
  success: {
    tag: 'Proceso concluido',
    title: 'Tu contraseña fue actualizada',
    // PLACEHOLDER: validar antes de publicar (depende de lo que haga el backend)
    description:
      'Ya puedes iniciar sesión con tu nueva contraseña. Por seguridad, las sesiones activas en otros navegadores fueron cerradas.',
    loginButton: 'Ir a iniciar sesión',
  },
  errors: {
    tokenInvalid: 'El enlace de restablecimiento ya no es válido. Solicita un nuevo código.',
    tokenInvalidLink: 'Reiniciar recuperación',
    datos_invalidos: 'La contraseña no cumple las políticas de seguridad. Elige otra.',
    demasiados_intentos: 'Demasiados intentos. Inténtalo más tarde.',
    red: 'No pudimos conectar con el servidor. Inténtalo de nuevo.',
    desconocido: 'Ocurrió un error inesperado. Inténtalo de nuevo.',
  },
}
