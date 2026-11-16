// H1: chat sobre `/api/casos/{id}/mensajes` (CasosController). Cada caso es una conversación:
// el id de la conversación es el id del caso. Aún no hay conversaciones sin caso, marcado de
// leído ni carga de adjuntos (el backend solo acepta una URL ya subida).
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi, ErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import {
  folioExpediente,
  listarCasosApi,
  listarMensajesApi,
  noDisponible,
  normalizarTexto,
  obtenerIdUsuarioActual,
  type CasoResumenApi,
  type MensajeChatApi,
} from '@/features/expedientes/services/casos.api'
import type {
  ConversacionResumen,
  FiltroConversaciones,
  Mensaje,
  PeticionAbrirConversacion,
  PeticionMensaje,
  RespuestaConversaciones,
  RespuestaMensajes,
} from '../types/chat.types'

function aMensaje(m: MensajeChatApi, idUsuario: number): Mensaje {
  return {
    id: String(m.idMensaje),
    autor: m.idRemitente === idUsuario ? 'abogado' : 'cliente',
    texto: m.mensajeTexto,
    fecha: m.fechaHora,
    adjunto: m.archivoUrl ? { id: String(m.idMensaje), nombre: m.archivoNombre ?? 'Archivo', tipoArchivo: '', tamanoBytes: 0 } : null,
    leido: m.leido,
  }
}

function aConversacion(caso: CasoResumenApi, mensajes: Mensaje[]): ConversacionResumen {
  const ultimo = mensajes.at(-1)
  return {
    id: String(caso.idCaso),
    cliente: { id: String(caso.idCliente), nombre: caso.nombreCliente, organizacion: null, enDirectorio: true },
    expediente: { id: String(caso.idCaso), folio: folioExpediente(caso.idCaso), asunto: caso.titulo },
    ultimoMensaje: ultimo ? { texto: ultimo.texto, fecha: ultimo.fecha, autor: ultimo.autor } : null,
    noLeidos: mensajes.filter((m) => m.autor === 'cliente' && !m.leido).length,
  }
}

async function mensajesDe(idCaso: string, idUsuario: number): Promise<Mensaje[]> {
  return (await listarMensajesApi(idCaso)).map((m) => aMensaje(m, idUsuario)).sort((a, b) => a.fecha.localeCompare(b.fecha))
}

export async function listarConversaciones(filtro: FiltroConversaciones, busqueda: string): Promise<RespuestaConversaciones> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarConversacionesMock } = await import('./chat.mock')
    return listarConversacionesMock(filtro, busqueda)
  }

  const [casos, idUsuario] = await Promise.all([listarCasosApi(), obtenerIdUsuarioActual()])
  const conversaciones = await Promise.all(casos.map(async (caso) => aConversacion(caso, await mensajesDe(String(caso.idCaso), idUsuario))))

  const texto = normalizarTexto(busqueda.trim())
  const base = conversaciones
    .filter((c) => !texto || normalizarTexto(`${c.cliente.nombre} ${c.expediente?.folio ?? ''} ${c.expediente?.asunto ?? ''}`).includes(texto))
    .sort((a, b) => (b.ultimoMensaje?.fecha ?? '').localeCompare(a.ultimoMensaje?.fecha ?? ''))

  return {
    conversaciones: filtro === 'no_leidas' ? base.filter((c) => c.noLeidos > 0) : base,
    totales: { todas: base.length, no_leidas: base.filter((c) => c.noLeidos > 0).length },
  }
}

/** Busca el caso del cliente (el indicado o el más reciente). Sin caso no hay chat todavía. */
export async function abrirConversacion(peticion: PeticionAbrirConversacion): Promise<{ id: string }> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { abrirConversacionMock } = await import('./chat.mock')
    return abrirConversacionMock(peticion)
  }

  const casos = (await listarCasosApi())
    .filter((c) => String(c.idCliente) === peticion.clienteId)
    .sort((a, b) => b.fechaCreacion.localeCompare(a.fechaCreacion))
  const caso = peticion.expedienteId ? casos.find((c) => String(c.idCaso) === peticion.expedienteId) : casos[0]
  if (!caso) throw new ErrorApi('no_encontrado', undefined, 'El chat se habilita cuando el cliente tiene un expediente contigo.')
  return { id: String(caso.idCaso) }
}

export async function obtenerMensajes(id: string): Promise<RespuestaMensajes> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerMensajesMock } = await import('./chat.mock')
    return obtenerMensajesMock(id)
  }

  const [casos, idUsuario] = await Promise.all([listarCasosApi(), obtenerIdUsuarioActual()])
  const caso = casos.find((c) => String(c.idCaso) === id)
  if (!caso) throw new ErrorApi('no_encontrado')
  const mensajes = await mensajesDe(id, idUsuario)
  return { conversacion: aConversacion(caso, mensajes), mensajes }
}

/** El backend aún no marca mensajes como leídos: no hace nada. */
export async function marcarConversacionLeida(id: string): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { marcarConversacionLeidaMock } = await import('./chat.mock')
    return marcarConversacionLeidaMock(id)
  }
}

/** `POST /casos/{id}/mensajes` con `{ mensajeTexto }`. Los adjuntos aún no se pueden subir. */
export async function enviarMensaje(id: string, peticion: PeticionMensaje): Promise<Mensaje> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { enviarMensajeMock } = await import('./chat.mock')
    return enviarMensajeMock(id, peticion)
  }

  if (peticion.archivo) throw new ErrorApi('no_disponible', undefined, 'Por ahora solo se pueden enviar mensajes de texto.')

  try {
    const [respuesta, idUsuario] = await Promise.all([
      api.post<MensajeChatApi>(ENDPOINTS.casos.mensajes(id), { mensajeTexto: peticion.texto, tipoMensaje: 'texto' }),
      obtenerIdUsuarioActual(),
    ])
    return aMensaje(respuesta.data, idUsuario)
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** El backend guarda la URL del adjunto pero no la firma. */
export async function obtenerUrlAdjunto(id: string, adjuntoId: string): Promise<{ url: string; expiraEn: string }> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerUrlAdjuntoMock } = await import('./chat.mock')
    return obtenerUrlAdjuntoMock(id, adjuntoId)
  }
  noDisponible()
}
