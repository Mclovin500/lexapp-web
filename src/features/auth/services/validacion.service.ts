// PROVISIONAL: endpoint y nombres de campos por confirmar con el backend
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { USAR_MOCKS } from '@/api/mocks'
import { mapearErrorApi } from '../lib/mapear-error'
import type { RespuestaValidacion } from '../types/validacion-profesional.types'

/** A5A: estado real de la validación profesional (requiere sesión). */
export async function obtenerValidacion(): Promise<RespuestaValidacion> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerValidacionMock } = await import('./validacion.mock')
    return obtenerValidacionMock()
  }

  try {
    const respuesta = await api.get<RespuestaValidacion>(ENDPOINTS.abogado.validacion)
    return respuesta.data
  } catch (error: unknown) {
    throw mapearErrorApi(error, 'formulario')
  }
}
