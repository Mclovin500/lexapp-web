// PROVISIONAL: endpoint y nombres de campos por confirmar con el backend
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import type { ResumenDashboard } from '../types/dashboard.types'

/** B1: todo el resumen en una sola petición. */
export async function obtenerResumenDashboard(): Promise<ResumenDashboard> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerResumenDashboardMock } = await import('./dashboard.mock')
    return obtenerResumenDashboardMock()
  }

  try {
    const respuesta = await api.get<ResumenDashboard>(ENDPOINTS.dashboard.resumen)
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}
