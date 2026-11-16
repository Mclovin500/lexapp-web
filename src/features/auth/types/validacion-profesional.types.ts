import type { EstadoValidacion } from './sesion.types'

/** `ValidacionAbogadoResponse` del backend (`GET /abogado/validacion`, A5A), ya normalizada. */
export interface RespuestaValidacion {
  estado: EstadoValidacion
  /** Folio `EXP-000123` generado por el backend. */
  folio: string
  /** ISO 8601. */
  fechaEnvio: string
  nombreCompleto: string
  /** Ya enmascarada por el backend; el front no la transforma. */
  cedulaEnmascarada: string
  /** Nombres de las especialidades separados por coma; `null` si no tiene. */
  especialidad: string | null
  /** Motivo de rechazo o corrección (`abogados.motivo_rechazo`). */
  motivo: string | null
}
