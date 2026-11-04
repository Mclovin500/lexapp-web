// PROVISIONAL: endpoints y nombres de campos por confirmar con el backend
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import type { FiltroNotificaciones, RespuestaNotificaciones } from '../types/notificaciones.types'

/** B1A: listado filtrado y totales por filtro. */
export async function listarNotificaciones(filtro: FiltroNotificaciones): Promise<RespuestaNotificaciones> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarNotificacionesMock } = await import('./notificaciones.mock')
    return listarNotificacionesMock(filtro)
  }

  try {
    const respuesta = await api.get<RespuestaNotificaciones>(ENDPOINTS.notificaciones.listado, {
      params: { filtro },
    })
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** B1A: marca una notificación como leída (204). */
export async function marcarNotificacionLeida(id: string): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { marcarNotificacionLeidaMock } = await import('./notificaciones.mock')
    return marcarNotificacionLeidaMock(id)
  }

  try {
    await api.patch(ENDPOINTS.notificaciones.detalle(id), { leida: true })
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** B1A: marca todas como leídas (204). */
export async function marcarTodasLeidas(): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { marcarTodasLeidasMock } = await import('./notificaciones.mock')
    return marcarTodasLeidasMock()
  }

  try {
    await api.post(ENDPOINTS.notificaciones.marcarTodasLeidas)
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}
