// F1/F2 y selectores: clientes con relación profesional, armados desde los casos del abogado
// (`/api/casos/mis-casos` y `/api/casos/{id}`). Aún no hay endpoint de clientes: solo aparecen
// los clientes que ya tienen un expediente con el abogado.
import { ErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import { aDocumentoExpediente } from '@/features/expedientes/services/documentos.service'
import { aExpedienteResumen } from '@/features/expedientes/services/expedientes.service'
import {
  estadoExpediente,
  folioExpediente,
  listarCasosApi,
  listarDocumentosApi,
  listarFacturasApi,
  normalizarTexto,
  obtenerCasoApi,
  type CasoResumenApi,
} from '@/features/expedientes/services/casos.api'
import { aMovimiento } from '@/features/pagos/services/pagos.service'
import type { ClienteDetalle, ClienteResumen, FiltroClientes, FiltrosClientes, OpcionCliente, RespuestaClientes } from '../types/clientes.types'

/** Casos agrupados por cliente, del más reciente al más antiguo. */
async function casosPorCliente(): Promise<Map<string, CasoResumenApi[]>> {
  const grupos = new Map<string, CasoResumenApi[]>()
  const casos = (await listarCasosApi()).sort((a, b) => b.fechaCreacion.localeCompare(a.fechaCreacion))
  for (const caso of casos) {
    const id = String(caso.idCliente)
    grupos.set(id, [...(grupos.get(id) ?? []), caso])
  }
  return grupos
}

/** El correo y el teléfono solo vienen en el detalle del caso. */
async function aResumen(id: string, casos: CasoResumenApi[]): Promise<ClienteResumen> {
  const detalle = await obtenerCasoApi(String(casos[0].idCaso))
  const abiertos = casos.filter((c) => estadoExpediente(c.estadoCaso) === 'activo').length
  return {
    id,
    nombre: detalle.nombreCliente,
    organizacion: null,
    tipoPersona: 'fisica',
    correo: detalle.emailCliente ?? '',
    telefono: detalle.telefonoCliente,
    expedientes: { total: casos.length, abiertos },
    ultimaActividad: detalle.updatedAt ?? casos[0].fechaCreacion,
    estado: abiertos > 0 ? 'activo' : 'inactivo',
  }
}

export async function listarOpcionesClientes(): Promise<OpcionCliente[]> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarOpcionesClientesMock } = await import('./clientes.mock')
    return listarOpcionesClientesMock()
  }

  const grupos = await casosPorCliente()
  return [...grupos.entries()]
    .map(([id, casos]) => ({ id, nombre: casos[0].nombreCliente, organizacion: null }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
}

export async function listarClientes(filtros: FiltrosClientes): Promise<RespuestaClientes> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarClientesMock } = await import('./clientes-directorio.mock')
    return listarClientesMock(filtros)
  }

  const grupos = await casosPorCliente()
  const todos = await Promise.all([...grupos.entries()].map(([id, casos]) => aResumen(id, casos)))
  const busqueda = normalizarTexto(filtros.busqueda.trim())
  const base = todos
    .filter((c) => !busqueda || normalizarTexto(`${c.nombre} ${c.correo}`).includes(busqueda))
    .sort((a, b) => b.ultimaActividad.localeCompare(a.ultimaActividad))
  const contar = (estado: FiltroClientes) => (estado === 'todos' ? base.length : base.filter((c) => c.estado === estado).length)
  const filtrados = base.filter((c) => filtros.estado === 'todos' || c.estado === filtros.estado)
  const inicio = (filtros.pagina - 1) * filtros.porPagina

  return {
    clientes: filtrados.slice(inicio, inicio + filtros.porPagina),
    total: filtrados.length,
    totalesPorEstado: {
      todos: contar('todos'),
      activo: contar('activo'),
      en_propuesta: contar('en_propuesta'),
      inactivo: contar('inactivo'),
    },
  }
}

export async function obtenerCliente(id: string): Promise<ClienteDetalle> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerClienteMock } = await import('./clientes-directorio.mock')
    return obtenerClienteMock(id)
  }

  const casos = (await casosPorCliente()).get(id)
  if (!casos) throw new ErrorApi('no_encontrado')

  const [resumen, porCaso] = await Promise.all([
    aResumen(id, casos),
    Promise.all(
      casos.map(async (caso) => {
        const [documentos, facturas] = await Promise.all([listarDocumentosApi(String(caso.idCaso)), listarFacturasApi(String(caso.idCaso))])
        return { caso, documentos, facturas }
      }),
    ),
  ])

  const documentos = porCaso
    .flatMap(({ caso, documentos: lista }) =>
      lista.map((d) => {
        const doc = aDocumentoExpediente(d, caso.nombreAbogado)
        return { id: doc.id, nombre: doc.nombre, categoria: doc.categoria, estado: doc.estado, fechaCarga: doc.fechaCarga, expediente: { id: String(caso.idCaso), folio: folioExpediente(caso.idCaso) } }
      }),
    )
    .sort((a, b) => b.fechaCarga.localeCompare(a.fechaCarga))
  const pagos = porCaso.flatMap(({ caso, facturas }) => facturas.map((f) => aMovimiento(f, caso))).sort((a, b) => b.fecha.localeCompare(a.fecha))

  return {
    ...resumen,
    clienteDesde: casos[casos.length - 1].fechaCreacion,
    expedientesRelacionados: casos.map(aExpedienteResumen),
    interacciones: [
      ...casos.map((c) => ({ id: `exp-${c.idCaso}`, tipo: 'expediente' as const, descripcion: `Expediente abierto: ${c.titulo}`, fecha: c.fechaCreacion, referenciaId: String(c.idCaso) })),
      ...documentos.map((d) => ({ id: `doc-${d.id}`, tipo: 'documento' as const, descripcion: `Documento cargado: ${d.nombre}`, fecha: d.fechaCarga, referenciaId: d.expediente.id })),
      ...pagos.map((p) => ({ id: `pago-${p.id}`, tipo: 'pago' as const, descripcion: `Cobro ${p.folio}: ${p.concepto}`, fecha: p.fecha, referenciaId: p.id })),
    ].sort((a, b) => b.fecha.localeCompare(a.fecha)),
    documentos,
    pagos,
  }
}
