import type { RespuestaReenvio } from './auth.types'

/** `POST /auth/recuperacion/solicitar` (A2B). */
export interface PeticionSolicitarRecuperacion {
  correo: string
}

/** 202: misma respuesta exista o no la cuenta (no revela si el correo está registrado). */
export interface RespuestaSolicitarRecuperacion extends RespuestaReenvio {
  correoEnmascarado: string
}

/** `POST /auth/recuperacion/verificar-codigo` (A2C). */
export interface PeticionVerificarCodigoRecuperacion {
  correo: string
  codigo: string
}

export interface RespuestaVerificarCodigoRecuperacion {
  /** Token de un solo uso para A2D. Solo se conserva en memoria. */
  tokenRestablecimiento: string
}

/** `POST /auth/recuperacion/reenviar-codigo` (A2C). */
export interface PeticionReenviarCodigoRecuperacion {
  correo: string
}

/** `POST /auth/recuperacion/nueva-contrasena` (A2D). Responde 204. */
export interface PeticionNuevaContrasena {
  tokenRestablecimiento: string
  contrasena: string
}
