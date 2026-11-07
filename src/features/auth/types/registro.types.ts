/** Cuerpo de `POST /auth/registro` (A3). La confirmación de contraseña no se envía. */
export interface DatosRegistro {
  primerNombre: string
  /** Opcional; `null` si no se captura. */
  segundoNombre: string | null
  apellidoPaterno: string
  apellidoMaterno: string
  correo: string
  telefono: string | null
  contrasena: string
  aceptaTerminos: true
}

import type { RespuestaReenvio } from './auth.types'

/**
 * El backend envía el código de verificación al correo y responde con el correo
 * enmascarado y los tiempos del código (para A3A).
 */
export interface RespuestaRegistro extends RespuestaReenvio {
  correoEnmascarado: string
}

export type TipoErrorRegistro =
  | 'correo_registrado'
  | 'datos_invalidos'
  | 'demasiados_intentos'
  | 'red'
  | 'desconocido'

export class ErrorRegistro extends Error {
  readonly tipo: TipoErrorRegistro

  constructor(tipo: TipoErrorRegistro, mensaje?: string) {
    super(mensaje ?? tipo)
    this.name = 'ErrorRegistro'
    this.tipo = tipo
  }
}
