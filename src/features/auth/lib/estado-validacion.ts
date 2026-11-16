import type { EstadoValidacion } from '../types/sesion.types'

/**
 * `abogados.estado_verificacion` del backend → estado de la UI.
 * `verificado` → `validado`; un valor desconocido o nulo se trata como `pendiente`
 * (nunca se muestra "validado" si el backend no lo dice).
 */
export function aEstadoValidacion(estado: string | null | undefined): EstadoValidacion {
  switch (estado) {
    case 'verificado':
      return 'validado'
    case 'rechazado':
      return 'rechazado'
    case 'requiere_correccion':
      return 'requiere_correccion'
    default:
      return 'pendiente'
  }
}
