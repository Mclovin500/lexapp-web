// A1 y RutaProtegida: GET /api/auth/sesion (AuthController, requiere Bearer).
import { isAxiosError } from 'axios'
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { USAR_MOCKS } from '@/api/mocks'
import { borrarToken, leerToken } from '@/api/token'
import { aEstadoValidacion } from '../lib/estado-validacion'
import type { EstadoSesion, RespuestaSesion } from '../types/sesion.types'

/**
 * Consulta si el navegador ya tiene una sesión válida.
 * Sin token → sin sesión (no se consulta) · 200 de abogado → sesión activa ·
 * 401/404 → token inválido o vencido: se borra · otro error → se propaga.
 */
export async function obtenerSesion(): Promise<EstadoSesion> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerSesionMock } = await import('./sesion.mock')
    return obtenerSesionMock()
  }

  if (!leerToken()) return { activa: false }

  try {
    const respuesta = await api.get<RespuestaSesion>(ENDPOINTS.auth.sesion)
    if (respuesta.data.tipoUsuario !== 'abogado') {
      borrarToken()
      return { activa: false }
    }
    return { activa: true, estadoValidacion: aEstadoValidacion(respuesta.data.estadoVerificacion) }
  } catch (error: unknown) {
    const status = isAxiosError(error) ? error.response?.status : undefined
    if (status === 401 || status === 404) {
      borrarToken()
      return { activa: false }
    }
    throw error
  }
}
