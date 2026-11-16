// A5A: GET /api/abogado/validacion (AbogadosController, rol abogado).
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { USAR_MOCKS } from '@/api/mocks'
import { aEstadoValidacion } from '../lib/estado-validacion'
import { mapearErrorApi } from '../lib/mapear-error'
import type { RespuestaValidacion } from '../types/validacion-profesional.types'

/** `ValidacionAbogadoResponse` tal como llega del backend. */
interface RespuestaValidacionApi {
  estado: string
  folio: string
  fechaEnvio: string
  nombreCompleto: string
  cedulaEnmascarada: string
  especialidad: string | null
  motivo: string | null
}

/** A5A: estado real de la validación profesional (requiere sesión). */
export async function obtenerValidacion(): Promise<RespuestaValidacion> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerValidacionMock } = await import('./validacion.mock')
    return obtenerValidacionMock()
  }

  try {
    const { data } = await api.get<RespuestaValidacionApi>(ENDPOINTS.abogado.validacion)
    return { ...data, estado: aEstadoValidacion(data.estado) }
  } catch (error: unknown) {
    // 403: el token no es de un abogado → se trata como sesión no válida.
    throw mapearErrorApi(error, 'formulario', { 403: 'sesion_expirada' })
  }
}
