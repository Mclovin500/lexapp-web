// PROVISIONAL: endpoint y nombres de campos por confirmar con el backend
import { isAxiosError } from 'axios'
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { USAR_MOCKS } from '@/api/mocks'
import type { EstadoSesion, RespuestaSesion } from '../types/sesion.types'

/**
 * Consulta si el navegador ya tiene una sesión válida.
 * 200 → sesión activa · 401 → sin sesión · otro error → se propaga.
 */
export async function obtenerSesion(): Promise<EstadoSesion> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerSesionMock } = await import('./sesion.mock')
    return obtenerSesionMock()
  }

  try {
    const respuesta = await api.get<RespuestaSesion>(ENDPOINTS.auth.sesion)
    return { activa: true, estadoValidacion: respuesta.data.estadoValidacion }
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return { activa: false }
    }
    throw error
  }
}
