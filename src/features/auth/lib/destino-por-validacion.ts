import { ROUTES } from '@/app/routes'
import type { EstadoValidacion } from '../types/sesion.types'

/**
 * Regla del flujo (docs/flujo-navegacion.md):
 * `validado` → B1 Dashboard; cualquier otro estado → A5A.
 * La reutilizan A1 y, más adelante, A2A.
 */
export function destinoPorValidacion(estado: EstadoValidacion): string {
  return estado === 'validado' ? ROUTES.dashboard : ROUTES.validationStatus
}
