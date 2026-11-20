// B1A: NotificacionesController (`/api/notificaciones`) de Back_Lexapp.
// El backend devuelve un arreglo simple del usuario de la sesión (sirve igual para la web y el móvil):
// el filtro y los totales se calculan aquí. Las notificaciones no traen el id del recurso de origen,
// así que cada una abre el listado de su módulo.
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import type {
  FiltroNotificaciones,
  Notificacion,
  RespuestaNotificaciones,
  TipoNotificacion,
} from '../types/notificaciones.types'

/** `NotificacionResponse` del backend. */
interface NotificacionApi {
  idNotificacion: number
  idUsuarioDestinatario: number
  tipoNotificacion: string
  titulo: string
  mensaje: string
  leida: boolean
  fechaCreacion: string
}

const TIPOS_CONOCIDOS: ReadonlySet<string> = new Set<TipoNotificacion>([
  'nueva_solicitud',
  'nuevo_mensaje',
  'propuesta_aceptada',
  'propuesta_rechazada',
  'documento_recibido',
  'documento_pendiente',
  'nuevo_cobro',
  'pago_realizado',
  'actualizacion_expediente',
  'proxima_videollamada',
])

/** `tipo_notificacion` es texto libre en la base de datos: lo que no se reconoce se muestra como aviso general. */
function aTipo(tipo: string): TipoNotificacion {
  const normalizado = tipo.trim().toLowerCase()
  return TIPOS_CONOCIDOS.has(normalizado) ? (normalizado as TipoNotificacion) : 'general'
}

function aNotificacion(n: NotificacionApi): Notificacion {
  return {
    id: String(n.idNotificacion),
    tipo: aTipo(n.tipoNotificacion),
    referencia: n.titulo,
    descripcion: n.mensaje,
    fecha: n.fechaCreacion,
    leida: n.leida,
    destino: {},
  }
}

/** B1A: listado filtrado y totales por filtro. */
export async function listarNotificaciones(filtro: FiltroNotificaciones): Promise<RespuestaNotificaciones> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarNotificacionesMock } = await import('./notificaciones.mock')
    return listarNotificacionesMock(filtro)
  }

  try {
    const respuesta = await api.get<NotificacionApi[]>(ENDPOINTS.notificaciones.listado)
    const todas = respuesta.data.map(aNotificacion).sort((a, b) => b.fecha.localeCompare(a.fecha))
    const noLeidas = todas.filter((n) => !n.leida)
    const leidas = todas.filter((n) => n.leida)
    const porFiltro: Record<FiltroNotificaciones, Notificacion[]> = { todas, no_leidas: noLeidas, leidas }
    return {
      notificaciones: porFiltro[filtro],
      totales: { todas: todas.length, no_leidas: noLeidas.length, leidas: leidas.length },
    }
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** Header: notificaciones sin leer (`GET /notificaciones/conteo`). */
export async function contarNotificacionesNoLeidas(): Promise<number> {
  try {
    const respuesta = await api.get<{ totalNoLeidas: number }>(ENDPOINTS.notificaciones.conteo)
    return respuesta.data.totalNoLeidas
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** B1A: `PATCH /notificaciones/{id}/leer`. */
export async function marcarNotificacionLeida(id: string): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { marcarNotificacionLeidaMock } = await import('./notificaciones.mock')
    return marcarNotificacionLeidaMock(id)
  }

  try {
    await api.patch(ENDPOINTS.notificaciones.leer(id))
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** B1A: `PATCH /notificaciones/leer-todas`. */
export async function marcarTodasLeidas(): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { marcarTodasLeidasMock } = await import('./notificaciones.mock')
    return marcarTodasLeidasMock()
  }

  try {
    await api.patch(ENDPOINTS.notificaciones.marcarTodasLeidas)
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}
