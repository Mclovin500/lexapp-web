import type { EstadoValidacion } from './sesion.types'

/** Valores del formulario P02. */
export interface CredencialesLogin {
  correo: string
  contrasena: string
}

/** `LoginResponse` del backend (`POST /auth/login`). */
export interface RespuestaLoginApi {
  token: string
  expira: string
  idUsuario: number
  email: string
  tipoUsuario: string
  idPerfil: number
  /** Solo para abogados: pendiente | verificado | rechazado | requiere_correccion. */
  estadoVerificacion: string | null
}

/** Lo que la UI necesita tras iniciar sesión (el token ya quedó guardado). */
export interface RespuestaLogin {
  estadoValidacion: EstadoValidacion
}

/** Tiempos de un código enviado por correo (los fija el front con los valores del backend). */
export interface RespuestaReenvio {
  reenviarEnSegundos: number
  expiraEnSegundos: number
}

/** `ApiResponse` del backend (`/Verificacion/*`). */
export interface RespuestaApi {
  exito: boolean
  mensaje: string
}

export type TipoErrorAuth =
  | 'credenciales'
  | 'cuenta_no_abogado'
  | 'correo_no_verificado'
  | 'cuenta_desactivada'
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
  /** Texto `mensaje` que devolvió el backend, si lo hubo. */
  readonly mensajeServidor?: string

  constructor(tipo: TipoErrorAuth, mensaje?: string, mensajeServidor?: string) {
    super(mensaje ?? tipo)
    this.name = 'ErrorAutenticacion'
    this.tipo = tipo
    this.mensajeServidor = mensajeServidor
  }
}
