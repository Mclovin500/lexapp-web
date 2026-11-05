// PROVISIONAL: endpoints y nombres de campos por confirmar con el backend (docs/contrato-api-agenda-chat.md)
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import type {
  FiltroConversaciones,
  Mensaje,
  PeticionAbrirConversacion,
  PeticionMensaje,
  RespuestaConversaciones,
  RespuestaMensajes,
} from '../types/chat.types'

const { conversaciones } = ENDPOINTS

export async function listarConversaciones(filtro: FiltroConversaciones, busqueda: string): Promise<RespuestaConversaciones> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarConversacionesMock } = await import('./chat.mock')
    return listarConversacionesMock(filtro, busqueda)
  }

  try {
    const respuesta = await api.get<RespuestaConversaciones>(conversaciones.listado, {
      params: { filtro: filtro === 'todas' ? undefined : filtro, busqueda: busqueda || undefined },
    })
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function abrirConversacion(peticion: PeticionAbrirConversacion): Promise<{ id: string }> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { abrirConversacionMock } = await import('./chat.mock')
    return abrirConversacionMock(peticion)
  }

  try {
    const respuesta = await api.post<{ id: string }>(conversaciones.listado, peticion)
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function obtenerMensajes(id: string): Promise<RespuestaMensajes> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerMensajesMock } = await import('./chat.mock')
    return obtenerMensajesMock(id)
  }

  try {
    const respuesta = await api.get<RespuestaMensajes>(conversaciones.mensajes(id))
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function marcarConversacionLeida(id: string): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { marcarConversacionLeidaMock } = await import('./chat.mock')
    return marcarConversacionLeidaMock(id)
  }

  try {
    await api.post(conversaciones.leida(id))
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** Texto y archivo opcional como multipart/form-data. */
export async function enviarMensaje(id: string, peticion: PeticionMensaje): Promise<Mensaje> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { enviarMensajeMock } = await import('./chat.mock')
    return enviarMensajeMock(id, peticion)
  }

  const datos = new FormData()
  datos.append('texto', peticion.texto)
  if (peticion.archivo) datos.append('archivo', peticion.archivo)

  try {
    const respuesta = await api.post<Mensaje>(conversaciones.mensajes(id), datos)
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** URL temporal firmada del adjunto (se pide en cada descarga). */
export async function obtenerUrlAdjunto(id: string, adjuntoId: string): Promise<{ url: string; expiraEn: string }> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerUrlAdjuntoMock } = await import('./chat.mock')
    return obtenerUrlAdjuntoMock(id, adjuntoId)
  }

  try {
    const respuesta = await api.get<{ url: string; expiraEn: string }>(conversaciones.adjunto(id, adjuntoId))
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}
