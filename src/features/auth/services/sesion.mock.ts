// MOCK: eliminar al conectar el backend
import type { EstadoSesion, EstadoValidacion } from '../types/sesion.types'

/**
 * Estado de validación del abogado en todos los mocks (A1, A2A y, más adelante, A5A).
 * `validado` → B1. Cualquier otro → A5A.
 */
export const ESTADO_VALIDACION_MOCK: EstadoValidacion = 'validado'

/** `false`: A1 redirige a P02. `true`: A1 redirige según ESTADO_VALIDACION_MOCK. */
const SESION_ACTIVA_MOCK = false

export async function obtenerSesionMock(): Promise<EstadoSesion> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return SESION_ACTIVA_MOCK
    ? { activa: true, estadoValidacion: ESTADO_VALIDACION_MOCK }
    : { activa: false }
}
