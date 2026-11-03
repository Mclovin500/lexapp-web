export type EstadoValidacion = 'pendiente' | 'validado' | 'requiere_correccion' | 'rechazado'

/** Respuesta del backend en `GET /auth/sesion` cuando hay sesión activa. */
export interface RespuestaSesion {
  estadoValidacion: EstadoValidacion
}

/** Resultado normalizado que consume la UI: con o sin sesión. */
export type EstadoSesion =
  | { activa: false }
  | { activa: true; estadoValidacion: EstadoValidacion }
