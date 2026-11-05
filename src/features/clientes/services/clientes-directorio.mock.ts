// MOCK: eliminar al conectar el backend
// F1 y F2: combinan los datos base del cliente con sus expedientes, propuestas, documentos y pagos.
import { esperar, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorApi } from '@/api/errores'
import { documentosDeExpedienteMock } from '@/features/expedientes/services/documentos.mock'
import { aResumenExpedienteMock, expedientesDeClienteMock } from '@/features/expedientes/services/expedientes.mock'
import { estadosMovimiento } from '@/features/pagos/content/estados-movimiento.content'
import { movimientosDeMock } from '@/features/pagos/services/pagos.mock'
import { propuestasDeClienteMock } from '@/features/propuestas/services/propuestas.mock'
import { solicitudesDeClienteMock } from '@/features/solicitudes/services/solicitudes.mock'
import type {
  ClienteDetalle,
  ClienteResumen,
  EstadoCliente,
  FiltroClientes,
  FiltrosClientes,
  InteraccionCliente,
  RespuestaClientes,
} from '../types/clientes.types'
import { clientesMock, type ClienteRegistroMock } from './clientes.mock'

async function simularRed(): Promise<void> {
  await esperar()
  if (SIMULAR_ERROR_RED) throw new ErrorApi('red')
}

function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

function estadoCliente(clienteId: string): EstadoCliente {
  if (expedientesDeClienteMock(clienteId).some((e) => e.estado !== 'finalizado')) return 'activo'
  if (propuestasDeClienteMock(clienteId).some((p) => p.estado === 'enviada' || p.estado === 'pendiente_respuesta')) return 'en_propuesta'
  return 'inactivo'
}

function interaccionesDe(clienteId: string): InteraccionCliente[] {
  const lista: InteraccionCliente[] = []
  for (const s of solicitudesDeClienteMock(clienteId)) {
    lista.push({ id: `int-${s.id}`, tipo: 'solicitud', descripcion: `Envió la solicitud ${s.folio}: ${s.asunto}.`, fecha: s.fechaRecepcion, referenciaId: s.id })
  }
  for (const p of propuestasDeClienteMock(clienteId)) {
    if (p.estado === 'borrador' || !p.fechaEnvio) continue
    lista.push({ id: `int-${p.id}`, tipo: 'propuesta', descripcion: `Recibió la propuesta ${p.folio}: ${p.servicio}.`, fecha: p.fechaEnvio, referenciaId: p.id })
  }
  for (const e of expedientesDeClienteMock(clienteId)) {
    lista.push({ id: `int-${e.id}`, tipo: 'expediente', descripcion: `Se abrió el ${e.folio}: ${e.asunto}.`, fecha: e.fechaApertura, referenciaId: e.id })
    // Solo las actualizaciones que el abogado compartió con el cliente.
    for (const a of e.actualizaciones.filter((x) => x.visibleCliente)) {
      lista.push({ id: `int-${a.id}`, tipo: 'expediente', descripcion: `Actualización en el ${e.folio}: ${a.titulo}.`, fecha: a.fecha, referenciaId: e.id })
    }
    for (const d of documentosDeExpedienteMock(e.id).filter((x) => x.cargadoPor.rol === 'cliente')) {
      lista.push({ id: `int-${d.id}`, tipo: 'documento', descripcion: `Cargó "${d.nombre}" en el ${e.folio}.`, fecha: d.fechaCarga, referenciaId: e.id })
    }
  }
  for (const m of movimientosDeMock({ clienteId })) {
    lista.push({ id: `int-${m.id}`, tipo: 'pago', descripcion: `${m.concepto}: ${estadosMovimiento[m.estado].label.toLowerCase()}.`, fecha: m.fecha, referenciaId: m.id })
  }
  return lista.sort((a, b) => b.fecha.localeCompare(a.fecha))
}

function aResumen(c: ClienteRegistroMock): ClienteResumen {
  const expedientes = expedientesDeClienteMock(c.id)
  const ultima = interaccionesDe(c.id)[0]?.fecha
  return {
    id: c.id,
    nombre: c.nombre,
    organizacion: c.organizacion,
    tipoPersona: c.tipoPersona,
    correo: c.correo,
    telefono: c.telefono,
    expedientes: { total: expedientes.length, abiertos: expedientes.filter((e) => e.estado !== 'finalizado').length },
    ultimaActividad: ultima && ultima > c.clienteDesde ? ultima : c.clienteDesde,
    estado: estadoCliente(c.id),
  }
}

export async function listarClientesMock(filtros: FiltrosClientes): Promise<RespuestaClientes> {
  await simularRed()
  const termino = normalizar(filtros.busqueda.trim())
  const base = clientesMock
    .filter((c) => !termino || [c.nombre, c.organizacion ?? '', c.correo].some((campo) => normalizar(campo).includes(termino)))
    .map(aResumen)
  const contar = (estado: FiltroClientes) => (estado === 'todos' ? base.length : base.filter((c) => c.estado === estado).length)
  const filtrados = base
    .filter((c) => filtros.estado === 'todos' || c.estado === filtros.estado)
    .sort((a, b) => b.ultimaActividad.localeCompare(a.ultimaActividad))
  const inicio = (filtros.pagina - 1) * filtros.porPagina
  return {
    clientes: filtrados.slice(inicio, inicio + filtros.porPagina),
    total: filtrados.length,
    totalesPorEstado: { todos: contar('todos'), activo: contar('activo'), en_propuesta: contar('en_propuesta'), inactivo: contar('inactivo') },
  }
}

/** 404 si el cliente no tiene relación con el abogado (9.4: solo información autorizada). */
export async function obtenerClienteMock(id: string): Promise<ClienteDetalle> {
  await simularRed()
  const cliente = clientesMock.find((c) => c.id === id)
  if (!cliente) throw new ErrorApi('no_encontrado')
  const expedientes = expedientesDeClienteMock(id)
  return {
    ...aResumen(cliente),
    clienteDesde: cliente.clienteDesde,
    expedientesRelacionados: expedientes.map(aResumenExpedienteMock).sort((a, b) => b.ultimaActualizacion.localeCompare(a.ultimaActualizacion)),
    interacciones: interaccionesDe(id).slice(0, 15),
    documentos: expedientes
      .flatMap((e) =>
        documentosDeExpedienteMock(e.id).map((d) => ({
          id: d.id, nombre: d.nombre, categoria: d.categoria, estado: d.estado, fechaCarga: d.fechaCarga,
          expediente: { id: e.id, folio: e.folio },
        })),
      )
      .sort((a, b) => b.fechaCarga.localeCompare(a.fechaCarga)),
    pagos: movimientosDeMock({ clienteId: id }),
  }
}
