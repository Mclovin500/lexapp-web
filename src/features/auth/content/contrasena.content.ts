import type { IdReglaContrasena } from '../schemas/contrasena.schema'

/** Textos del indicador de contraseña compartido (A3 y A2D). */
export const contrasenaContent = {
  title: 'Requisitos mínimos de seguridad:',
  /** Índice = número de reglas cumplidas (0 a 5). */
  strength: ['Incompleta', 'Débil', 'Débil', 'Media', 'Media', 'Segura'],
  rules: {
    longitud: 'Mínimo 10 caracteres',
    mayuscula: 'Una mayúscula (A-Z)',
    minuscula: 'Una minúscula (a-z)',
    numero: 'Un número (0-9)',
    especial: 'Un carácter especial (@, $, !, %, *, #, ?, &)',
  } satisfies Record<IdReglaContrasena, string>,
  // el backend es quien la valida: aquí solo se informa
  personalDataNote: 'Evita datos personales obvios o el dominio de tu correo.',
}
