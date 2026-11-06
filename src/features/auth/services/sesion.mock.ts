// MOCK: eliminar al conectar el backend
import type { EstadoSesion, EstadoValidacion } from '../types/sesion.types'

/**
 * Estado de validación del abogado en todos los mocks (A1, A2A y, más adelante, A5A).
 * `validado` → B1. Cualquier otro → A5A.
 */
export const ESTADO_VALIDACION_MOCK: EstadoValidacion = 'validado'

/**
 * Sesión al cargar la página. `true`: el panel se abre directo (cómodo para probar con las URLs);
 * `false`: el panel redirige a P02 hasta iniciar sesión (P02 → A2A).
 * En memoria: "Cerrar sesión" (J1) la termina y A2A la inicia; al recargar vuelve a este valor.
 */
const SESION_ACTIVA_MOCK = true

let sesionActiva = SESION_ACTIVA_MOCK

/** A2A con código correcto. */
export function iniciarSesionMock(): void {
  sesionActiva = true
}

/** J1 "Cerrar sesión". */
export function terminarSesionMock(): void {
  sesionActiva = false
}

export async function obtenerSesionMock(): Promise<EstadoSesion> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return sesionActiva ? { activa: true, estadoValidacion: ESTADO_VALIDACION_MOCK } : { activa: false }
}
