import type { EstadoValidacion } from './sesion.types'

/** `GET /abogado/validacion` (A5A). La UI muestra los datos tal como llegan. */
export interface RespuestaValidacion {
  estado: EstadoValidacion
  folio: string
  /** ISO 8601. */
  fechaEnvio: string
  nombreCompleto: string
  /** Ya enmascarada por el backend; el front no la transforma. */
  cedulaEnmascarada: string
  /** Valor del catálogo de especialidades (o texto, si el backend lo envía así). */
  especialidad: string
  /** Explicación del dictamen; se espera en `requiere_correccion` y `rechazado`. */
  motivo?: string | null
}
