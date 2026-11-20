// E1/E2: expedientes sobre CasosController (`/api/casos`) y ExpedientesController (`/api/expedientes`).
// El caso no guarda área jurídica, propuesta de origen ni actualizaciones de seguimiento. El historial
// viene de `GET /expedientes/{id}/timeline` (mensajes, citas, documentos y facturas) más la apertura.
// El estado se cambia con `PATCH /expedientes/{id}`; la nota del cambio todavía no se guarda.
import { ErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import { aMovimiento } from '@/features/pagos/services/pagos.service'
import { aReunion } from '@/features/agenda/services/agenda.service'
import type {
  EventoExpediente,
  ExpedienteDetalle,
  ExpedienteResumen,
  FiltroExpedientes,
  FiltrosExpedientes,
  OpcionExpediente,
  PeticionActualizacion,
  PeticionCambioEstado,
  RespuestaExpedientes,
} from '../types/expedientes.types'
import {
  actualizarExpedienteApi,
  AREA_SIN_ESPECIFICAR,
  estadoExpediente,
  folioExpediente,
  listarCasosApi,
  listarCitasApi,
  listarDocumentosApi,
  listarFacturasApi,
  noDisponible,
  normalizarTexto,
  obtenerCasoApi,
  obtenerDashboardExpedientesApi,
  obtenerLineaTiempoApi,
  type CasoResumenApi,
  type EstadoCasoApi,
  type EventoExpedienteApi,
} from './casos.api'
import { aDocumentoExpediente } from './documentos.service'

export function aExpedienteResumen(c: CasoResumenApi & { updatedAt?: string }): ExpedienteResumen {
  return {
    id: String(c.idCaso),
    folio: folioExpediente(c.idCaso),
    cliente: { id: String(c.idCliente), nombre: c.nombreCliente, organizacion: null },
    asunto: c.titulo,
    areaJuridica: AREA_SIN_ESPECIFICAR,
    estado: estadoExpediente(c.estadoCaso),
    fechaApertura: c.fechaCreacion,
    ultimaActualizacion: c.updatedAt ?? c.fechaCreacion,
  }
}

/** Expedientes activos del cliente (D4 cobro, G1 programar reunión). */
export async function listarOpcionesExpedientes(clienteId: string): Promise<OpcionExpediente[]> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarOpcionesExpedientesMock } = await import('./expedientes.mock')
    return listarOpcionesExpedientesMock(clienteId)
  }

  return (await listarCasosApi())
    .filter((c) => String(c.idCliente) === clienteId && estadoExpediente(c.estadoCaso) === 'activo')
    .map((c) => ({ id: String(c.idCaso), folio: folioExpediente(c.idCaso), asunto: c.titulo, clienteId: String(c.idCliente) }))
}

/** `ultimaActualizacion` de cada caso según el dashboard (si falla, se usa la fecha de apertura). */
async function ultimasActualizaciones(): Promise<Map<number, string>> {
  try {
    const { expedientes } = await obtenerDashboardExpedientesApi()
    return new Map(expedientes.map((e) => [e.idCaso, e.ultimaActualizacion]))
  } catch {
    return new Map()
  }
}

/**
 * E1: filtro, búsqueda y paginación en el navegador. El dashboard del backend filtra por un solo
 * estado y la web agrupa dos ("activo" = abierto + en progreso), así que se piden todos los casos.
 */
export async function listarExpedientes(filtros: FiltrosExpedientes): Promise<RespuestaExpedientes> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarExpedientesMock } = await import('./expedientes.mock')
    return listarExpedientesMock(filtros)
  }

  const busqueda = normalizarTexto(filtros.busqueda.trim())
  const [casos, actualizaciones] = await Promise.all([listarCasosApi(), ultimasActualizaciones()])
  const base = casos
    .map((c) => aExpedienteResumen({ ...c, updatedAt: actualizaciones.get(c.idCaso) }))
    .sort((a, b) => b.ultimaActualizacion.localeCompare(a.ultimaActualizacion))
    .filter(
      (e) =>
        (!filtros.area || e.areaJuridica === filtros.area) &&
        (!busqueda || normalizarTexto(`${e.folio} ${e.cliente.nombre} ${e.asunto}`).includes(busqueda)),
    )
  const contar = (estado: FiltroExpedientes) => (estado === 'todos' ? base.length : base.filter((e) => e.estado === estado).length)
  const filtrados = base.filter((e) => filtros.estado === 'todos' || e.estado === filtros.estado)
  const inicio = (filtros.pagina - 1) * filtros.porPagina

  return {
    expedientes: filtrados.slice(inicio, inicio + filtros.porPagina),
    total: filtrados.length,
    totalesPorEstado: {
      todos: contar('todos'),
      activo: contar('activo'),
      en_espera: contar('en_espera'),
      finalizado: contar('finalizado'),
    },
  }
}

const TIPOS_EVENTO: Record<string, EventoExpediente['tipo']> = {
  mensaje: 'mensaje',
  cita: 'reunion',
  documento: 'documento',
  factura: 'pago',
}

function aEvento(e: EventoExpedienteApi, autorPorDefecto: string): EventoExpediente {
  const remitente = e.metadata?.remitente
  return {
    id: `${e.tipoEvento}-${e.idEvento}`,
    tipo: TIPOS_EVENTO[e.tipoEvento] ?? 'estado',
    descripcion: e.descripcion,
    fecha: e.fechaHora,
    autor: typeof remitente === 'string' ? remitente : autorPorDefecto,
  }
}

/** E2: detalle del caso + documentos, facturas, citas y línea de tiempo (cinco consultas en paralelo). */
export async function obtenerExpediente(id: string): Promise<ExpedienteDetalle> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerExpedienteMock } = await import('./expediente-detalle.mock')
    return obtenerExpedienteMock(id)
  }

  const [caso, documentosApi, facturas, citas, lineaTiempo] = await Promise.all([
    obtenerCasoApi(id),
    listarDocumentosApi(id),
    listarFacturasApi(id),
    listarCitasApi(id),
    obtenerLineaTiempoApi(id),
  ])

  const documentos = documentosApi.map((d) => aDocumentoExpediente(d, caso.nombreAbogado)).sort((a, b) => b.fechaCarga.localeCompare(a.fechaCarga))
  const pagos = facturas.map((f) => aMovimiento(f, caso)).sort((a, b) => b.fecha.localeCompare(a.fecha))
  const reuniones = citas.map((c) => aReunion(c, caso))
  const proximas = reuniones
    .filter((r) => r.estado === 'programada' || r.estado === 'en_curso')
    .sort((a, b) => a.inicio.localeCompare(b.inicio))

  const historial: EventoExpediente[] = [
    { id: `apertura-${caso.idCaso}`, tipo: 'apertura' as const, descripcion: 'Expediente abierto al aceptar la propuesta.', fecha: caso.fechaCreacion, autor: 'Sistema' },
    ...lineaTiempo.eventos.map((e) => aEvento(e, caso.nombreAbogado)),
].sort((a, b) => b.fecha.localeCompare(a.fecha))

  return {
    ...aExpedienteResumen(caso),
    cliente: {
      id: String(caso.idCliente),
      nombre: caso.nombreCliente,
      organizacion: null,
      tipoPersona: 'fisica',
      correo: caso.emailCliente ?? '',
      telefono: caso.telefonoCliente,
    },
    descripcion: caso.descripcion ?? '',
    propuesta: null,
    historial,
    actualizaciones: [],
    documentos: {
      total: documentos.length,
      pendientesRevision: documentos.filter((d) => d.estado === 'pendiente_revision').length,
      recientes: documentos.slice(0, 3),
    },
    pagos,
    proximasReuniones: proximas.slice(0, 3).map((r) => ({
      id: r.id,
      titulo: r.titulo,
      cliente: r.cliente.nombre,
      inicio: r.inicio,
      fin: r.fin,
      expediente: r.expediente?.folio ?? null,
    })),
  }
}

/** Aún no hay endpoint para actualizaciones de seguimiento. */
export async function registrarActualizacion(id: string, peticion: PeticionActualizacion): Promise<{ id: string }> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { registrarActualizacionMock } = await import('./expedientes.mock')
    return registrarActualizacionMock(id, peticion)
  }
  noDisponible()
}

/** Estado del backend para cada estado de la web. "En espera" todavía no existe en `estado_caso_enum`. */
const ESTADO_API: Partial<Record<PeticionCambioEstado['estado'], EstadoCasoApi>> = {
  activo: 'en_progreso',
  finalizado: 'cerrado',
}

/** `PATCH /expedientes/{id}` con `{ estadoCaso }` (solo el abogado del caso). */
export async function cambiarEstadoExpediente(id: string, peticion: PeticionCambioEstado): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { cambiarEstadoExpedienteMock } = await import('./expedientes.mock')
    return cambiarEstadoExpedienteMock(id, peticion)
  }

  const estadoCaso = ESTADO_API[peticion.estado]
  if (!estadoCaso) throw new ErrorApi('no_disponible', undefined, 'El estado "En espera" aún no está disponible.')
  await actualizarExpedienteApi(id, { estadoCaso })
}
