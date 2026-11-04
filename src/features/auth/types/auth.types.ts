export interface CredencialesLogin {
  correo: string
  contrasena: string
  recordarEquipo: boolean
}

export interface RespuestaLogin {
  requiereCodigo: boolean
  correoEnmascarado: string
  /** Segundos que faltan para poder reenviar el código (los decide el backend). */
  reenviarEnSegundos: number
  /** Vigencia del código enviado, en segundos. */
  expiraEnSegundos: number
}

/** Tiempos que devuelve el backend cada vez que envía o reenvía un código. */
export interface RespuestaReenvio {
  reenviarEnSegundos: number
  expiraEnSegundos: number
}

export type TipoErrorAuth =
  | 'credenciales'
  | 'cuenta_no_abogado'
  | 'codigo_incorrecto'
  | 'codigo_vencido'
  | 'conflicto'
  | 'datos_invalidos'
  | 'sesion_expirada'
  | 'demasiados_intentos'
  | 'red'
  | 'desconocido'

export class ErrorAutenticacion extends Error {
  readonly tipo: TipoErrorAuth

  constructor(tipo: TipoErrorAuth, mensaje?: string) {
    super(mensaje ?? tipo)
    this.name = 'ErrorAutenticacion'
    this.tipo = tipo
  }
}

