// C1, C2 y D1 contra Back_Lexapp (SolicitudCasoController).
// El backend solo expone la bandeja del abogado (`GET /solicitudes-caso/abogado/bandeja`) con las
// solicitudes pendientes: el detalle, la búsqueda y la paginación se resuelven aquí sobre esa lista.
// No hay área jurídica, prioridad ni documentos adjuntos en las solicitudes del backend.
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi, ErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import type { OpcionCliente } from '@/features/clientes/types/clientes.types'
import type {
  BandejaSolicitudApi,
  FiltroEstadoSolicitud,
  FiltrosSolicitudes,
  OpcionSolicitud,
  PeticionRechazoSolicitud,
  RespuestaListadoSolicitudes,
  RespuestaRechazoApi,
  SolicitudDetalle,
  UrlDocumentoSolicitud,
} from '../types/solicitudes.types'

export const SIN_AREA = 'Sin área especificada'

export function folioSolicitud(id: number | string): string {
  return `SOL-${String(id).padStart(5, '0')}`
}

function aDetalle(s: BandejaSolicitudApi): SolicitudDetalle {
  return {
    id: String(s.idSolicitud),
    folio: folioSolicitud(s.idSolicitud),
    cliente: {
      id: String(s.idCliente),
      nombre: s.nombreCliente || 'Cliente',
      tipoPersona: 'fisica',
      organizacion: null,
      correo: s.emailCliente,
      telefono: s.telefonoCliente,
    },
    areaJuridica: SIN_AREA,
    asunto: s.titulo,
    fechaRecepcion: s.fechaCreacion,
    estado: 'nueva',
    prioridad: null,
    descripcion: s.descripcionProblema,
    informacionAdicional: [],
    documentos: [],
    motivoRechazo: null,
  }
}

async function obtenerBandeja(): Promise<SolicitudDetalle[]> {
  try {
    const respuesta = await api.get<BandejaSolicitudApi[]>(ENDPOINTS.solicitudes.bandeja)
    return (respuesta.data ?? []).map(aDetalle)
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

/** C1: bandeja de solicitudes pendientes con búsqueda y paginación locales. */
export async function listarSolicitudes(filtros: FiltrosSolicitudes): Promise<RespuestaListadoSolicitudes> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarSolicitudesMock } = await import('./solicitudes.mock')
    return listarSolicitudesMock(filtros)
  }

  const todas = await obtenerBandeja()
  const busqueda = normalizar(filtros.busqueda.trim())
  const base = todas.filter(
    (s) => !busqueda || normalizar(`${s.cliente.nombre} ${s.asunto} ${s.folio}`).includes(busqueda),
  )
  const contar = (estado: FiltroEstadoSolicitud) => (estado === 'todas' ? base.length : base.filter((s) => s.estado === estado).length)
  const filtradas = base.filter((s) => filtros.estado === 'todas' || s.estado === filtros.estado)
  const inicio = (filtros.pagina - 1) * filtros.porPagina

  return {
    solicitudes: filtradas.slice(inicio, inicio + filtros.porPagina),
    total: filtradas.length,
    totalesPorEstado: {
      todas: contar('todas'),
      nueva: contar('nueva'),
      en_revision: contar('en_revision'),
      convertida_propuesta: contar('convertida_propuesta'),
      atendida: contar('atendida'),
    },
  }
}

/** D1: clientes con solicitudes pendientes (el backend exige una solicitud para cada propuesta). */
export async function listarClientesConSolicitud(): Promise<OpcionCliente[]> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarOpcionesClientes } = await import('@/features/clientes/services/clientes.service')
    return listarOpcionesClientes()
  }

  const bandeja = await obtenerBandeja()
  const clientes = new Map<string, OpcionCliente>()
  for (const s of bandeja) {
    if (!clientes.has(s.cliente.id)) clientes.set(s.cliente.id, { id: s.cliente.id, nombre: s.cliente.nombre, organizacion: null })
  }
  return [...clientes.values()].sort((a, b) => a.nombre.localeCompare(b.nombre))
}

/** D1: solicitudes pendientes del cliente para "Solicitud relacionada". */
export async function listarOpcionesSolicitudes(clienteId: string): Promise<OpcionSolicitud[]> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarOpcionesSolicitudesMock } = await import('./solicitudes.mock')
    return listarOpcionesSolicitudesMock(clienteId)
  }

  const bandeja = await obtenerBandeja()
  return bandeja
    .filter((s) => s.cliente.id === clienteId)
    .map((s) => ({ id: s.id, folio: s.folio, asunto: s.asunto }))
}

/** C2: detalle tomado de la bandeja (404 si ya no está pendiente o no es del abogado). */
export async function obtenerSolicitud(id: string): Promise<SolicitudDetalle> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerSolicitudMock } = await import('./solicitudes.mock')
    return obtenerSolicitudMock(id)
  }

  const solicitud = (await obtenerBandeja()).find((s) => s.id === id)
  if (!solicitud) throw new ErrorApi('no_encontrado')
  return solicitud
}

/** C2: las solicitudes del backend no traen documentos adjuntos; solo aplica en mocks. */
export async function obtenerUrlDocumentoSolicitud(solicitudId: string, documentoId: string): Promise<UrlDocumentoSolicitud> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerUrlDocumentoSolicitudMock } = await import('./solicitudes.mock')
    return obtenerUrlDocumentoSolicitudMock(solicitudId, documentoId)
  }
  throw new ErrorApi('no_encontrado')
}

/** C2 "Revisar información": el backend no registra el paso a "en revisión"; solo se lleva el foco. */
export async function revisarSolicitud(id: string): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { revisarSolicitudMock } = await import('./solicitudes.mock')
    return revisarSolicitudMock(id)
  }
}

/**
 * C2 "Rechazar solicitud": `POST /solicitudes-caso/abogado/{id}/rechazar`.
 * El backend responde 400 si la solicitud ya no está pendiente; se muestra como conflicto.
 */
export async function rechazarSolicitud(id: string, peticion: PeticionRechazoSolicitud): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { rechazarSolicitudMock } = await import('./solicitudes.mock')
    return rechazarSolicitudMock(id, peticion)
  }

  try {
    await api.post<RespuestaRechazoApi>(ENDPOINTS.solicitudes.rechazar(id), { motivo: peticion.motivo })
  } catch (error: unknown) {
    const errorApi = aErrorApi(error)
    if (errorApi.tipo === 'datos_invalidos' && errorApi.detalle?.includes('ya fue procesada')) {
      throw new ErrorApi('conflicto', undefined, errorApi.detalle)
    }
    throw errorApi
  }
}
