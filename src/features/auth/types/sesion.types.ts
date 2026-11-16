/** Estado de validación que usa la UI. El backend llama `verificado` a lo que aquí es `validado`. */
export type EstadoValidacion = 'pendiente' | 'validado' | 'requiere_correccion' | 'rechazado'

/** `SesionUsuarioResponse` del backend (`GET /auth/sesion`). */
export interface RespuestaSesion {
  idUsuario: number
  idPerfil: number
  email: string
  tipoUsuario: string
  estadoVerificacion: string | null
}

/** Resultado normalizado que consume la UI: con o sin sesión. */
export type EstadoSesion =
  | { activa: false }
  | { activa: true; estadoValidacion: EstadoValidacion }
