// PROVISIONAL: endpoints y nombres de campos por confirmar con el backend
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import type {
  FiltrosSolicitudes,
  OpcionSolicitud,
  PeticionRechazoSolicitud,
  RespuestaListadoSolicitudes,
  SolicitudDetalle,
  UrlDocumentoSolicitud,
} from '../types/solicitudes.types'

/** C1: listado con filtros, búsqueda y paginación del lado del servidor. */
export async function listarSolicitudes(filtros: FiltrosSolicitudes): Promise<RespuestaListadoSolicitudes> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarSolicitudesMock } = await import('./solicitudes.mock')
    return listarSolicitudesMock(filtros)
  }

  try {
    const respuesta = await api.get<RespuestaListadoSolicitudes>(ENDPOINTS.solicitudes.listado, {
      params: {
        estado: filtros.estado === 'todas' ? undefined : filtros.estado,
        area: filtros.area ?? undefined,
        busqueda: filtros.busqueda || undefined,
        pagina: filtros.pagina,
        porPagina: filtros.porPagina,
      },
    })
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** D1: solicitudes abiertas del cliente para "Solicitud relacionada". */
export async function listarOpcionesSolicitudes(clienteId: string): Promise<OpcionSolicitud[]> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarOpcionesSolicitudesMock } = await import('./solicitudes.mock')
    return listarOpcionesSolicitudesMock(clienteId)
  }

  try {
    const respuesta = await api.get<OpcionSolicitud[]>(ENDPOINTS.solicitudes.opciones, { params: { clienteId } })
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** C2: detalle de una solicitud. */
export async function obtenerSolicitud(id: string): Promise<SolicitudDetalle> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerSolicitudMock } = await import('./solicitudes.mock')
    return obtenerSolicitudMock(id)
  }

  try {
    const respuesta = await api.get<SolicitudDetalle>(ENDPOINTS.solicitudes.detalle(id))
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** C2: URL temporal firmada de un documento adjunto (se pide en cada uso; no se guarda). */
export async function obtenerUrlDocumentoSolicitud(solicitudId: string, documentoId: string): Promise<UrlDocumentoSolicitud> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerUrlDocumentoSolicitudMock } = await import('./solicitudes.mock')
    return obtenerUrlDocumentoSolicitudMock(solicitudId, documentoId)
  }

  try {
    const respuesta = await api.get<UrlDocumentoSolicitud>(ENDPOINTS.solicitudes.urlDocumento(solicitudId, documentoId))
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** C2 "Revisar información": pasa la solicitud de nueva a en revisión (204). */
export async function revisarSolicitud(id: string): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { revisarSolicitudMock } = await import('./solicitudes.mock')
    return revisarSolicitudMock(id)
  }

  try {
    await api.post(ENDPOINTS.solicitudes.revisar(id))
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** C2 "Rechazar solicitud" (solo nueva o en revisión; 409 en otro estado). */
export async function rechazarSolicitud(id: string, peticion: PeticionRechazoSolicitud): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { rechazarSolicitudMock } = await import('./solicitudes.mock')
    return rechazarSolicitudMock(id, peticion)
  }

  try {
    await api.post(ENDPOINTS.solicitudes.rechazar(id), peticion)
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}
