export interface CredencialesLogin {
  correo: string
  contrasena: string
  recordarEquipo: boolean
}

export interface RespuestaLogin {
  requiereCodigo: boolean
  correoEnmascarado: string
}

export type TipoErrorAuth =
  | 'credenciales'
  | 'cuenta_no_abogado'
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

