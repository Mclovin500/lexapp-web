// G1/G1A: reuniones sobre las citas de cada caso (`/api/casos/{id}/citas`, CasosController).
// El id de una reunión es "idCaso-idCita". Las citas no guardan título, notas ni historial,
// y aún no hay proveedor de video ni endpoint de disponibilidad.
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi, ErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import {
  enCadaCaso,
  estadoExpediente,
  folioExpediente,
  idCompuesto,
  listarCasosApi,
  listarCitasApi,
  noDisponible,
  obtenerCasoApi,
  separarId,
  type CasoResumenApi,
  type CitaCasoApi,
  type EstadoCitaApi,
} from '@/features/expedientes/services/casos.api'
import type {
  AccesoSala,
  Disponibilidad,
  EstadoReunion,
  FiltrosReuniones,
  PeticionFinalizarReunion,
  PeticionReunion,
  PeticionReunionInmediata,
  ReunionDetalle,
  ReunionResumen,
} from '../types/agenda.types'

const HORA = 60 * 60 * 1000
const MINUTO = 60 * 1000

function finDe(cita: CitaCasoApi): string {
  return cita.fechaHoraFin ?? new Date(new Date(cita.fechaHoraInicio).getTime() + HORA).toISOString()
}

function aEstado(estado: EstadoCitaApi, inicio: string, fin: string): EstadoReunion {
  if (estado === 'cancelada') return 'cancelada'
  if (estado === 'completada') return 'finalizada'
  const ahora = Date.now()
  if (ahora > new Date(fin).getTime()) return 'no_realizada'
  if (ahora >= new Date(inicio).getTime()) return 'en_curso'
  return 'programada'
}

export function aReunion(cita: CitaCasoApi, caso: Pick<CasoResumenApi, 'idCaso' | 'idCliente' | 'nombreCliente' | 'titulo'>): ReunionResumen {
  const fin = finDe(cita)
  return {
    id: idCompuesto(caso.idCaso, cita.idCita),
    titulo: caso.titulo,
    cliente: { id: String(caso.idCliente), nombre: caso.nombreCliente },
    expediente: { id: String(caso.idCaso), folio: folioExpediente(caso.idCaso) },
    inicio: cita.fechaHoraInicio,
    fin,
    estado: aEstado(cita.estadoCita, cita.fechaHoraInicio, fin),
  }
}

async function todasLasReuniones(): Promise<ReunionResumen[]> {
  const citas = await enCadaCaso(listarCitasApi)
  return citas.map(({ caso, item }) => aReunion(item, caso))
}

export async function listarReuniones(filtros: FiltrosReuniones): Promise<ReunionResumen[]> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarReunionesMock } = await import('./reuniones.mock')
    return listarReunionesMock(filtros)
  }

  const ahora = Date.now()
  let reuniones = await todasLasReuniones()
  if (filtros.desde) reuniones = reuniones.filter((r) => new Date(r.fin).getTime() >= new Date(filtros.desde!).getTime())
  if (filtros.hasta) reuniones = reuniones.filter((r) => new Date(r.inicio).getTime() <= new Date(filtros.hasta!).getTime())

  if (filtros.alcance === 'proximas') {
    reuniones = reuniones
      .filter((r) => (r.estado === 'programada' || r.estado === 'en_curso') && new Date(r.fin).getTime() >= ahora)
      .sort((a, b) => a.inicio.localeCompare(b.inicio))
  } else if (filtros.alcance === 'historial') {
    reuniones = reuniones
      .filter((r) => r.estado !== 'programada' && r.estado !== 'en_curso')
      .sort((a, b) => b.inicio.localeCompare(a.inicio))
  } else {
    reuniones.sort((a, b) => a.inicio.localeCompare(b.inicio))
  }
  return filtros.limite ? reuniones.slice(0, filtros.limite) : reuniones
}

export async function obtenerReunion(id: string): Promise<ReunionDetalle> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerReunionMock } = await import('./reuniones.mock')
    return obtenerReunionMock(id)
  }

  const { idCaso, idItem } = separarId(id)
  const [caso, citas] = await Promise.all([obtenerCasoApi(idCaso), listarCitasApi(idCaso)])
  const cita = citas.find((c) => String(c.idCita) === idItem)
  if (!cita) throw new ErrorApi('no_encontrado')

  const resumen = aReunion(cita, caso)
  const notas = [cita.modalidad && `Modalidad: ${cita.modalidad}`, cita.ubicacion, cita.enlaceReunion].filter(Boolean).join(' · ')
  return {
    ...resumen,
    cliente: { ...resumen.cliente, organizacion: null, enDirectorio: true },
    notas: notas || null,
    origen: 'agenda',
    sala: {
      abreEn: new Date(new Date(resumen.inicio).getTime() - 10 * MINUTO).toISOString(),
      cierraEn: new Date(new Date(resumen.fin).getTime() + 30 * MINUTO).toISOString(),
    },
    motivoCancelacion: null,
    duracionRealSegundos: null,
    resumen: null,
    historial: [],
  }
}

/** Las citas viven dentro de un caso: sin expediente elegido se usa el caso activo más reciente del cliente. */
async function casoDeCliente(clienteId: string, expedienteId: string | null): Promise<string> {
  if (expedienteId) return expedienteId
  const caso = (await listarCasosApi())
    .filter((c) => String(c.idCliente) === clienteId && estadoExpediente(c.estadoCaso) === 'activo')
    .sort((a, b) => b.fechaCreacion.localeCompare(a.fechaCreacion))[0]
  if (!caso) throw new ErrorApi('datos_invalidos', undefined, 'El cliente no tiene un expediente activo para agendar la reunión.')
  return String(caso.idCaso)
}

async function agendar(idCaso: string, inicio: Date, duracionMinutos: number): Promise<{ id: string }> {
  try {
    const respuesta = await api.post<CitaCasoApi>(ENDPOINTS.casos.citas(idCaso), {
      fechaHoraInicio: inicio.toISOString(),
      fechaHoraFin: new Date(inicio.getTime() + duracionMinutos * MINUTO).toISOString(),
      modalidad: 'virtual',
    })
    return { id: idCompuesto(idCaso, respuesta.data.idCita) }
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

async function cambiarEstado(id: string, estadoCita: EstadoCitaApi): Promise<void> {
  const { idCaso, idItem } = separarId(id)
  try {
    await api.patch(ENDPOINTS.casos.estadoCita(idCaso, idItem), { estadoCita })
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** El título y las notas no tienen columna en `citas` todavía. */
export async function programarReunion(peticion: PeticionReunion): Promise<{ id: string }> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { programarReunionMock } = await import('./reuniones.mock')
    return programarReunionMock(peticion)
  }

  const idCaso = await casoDeCliente(peticion.clienteId, peticion.expedienteId)
  return agendar(idCaso, new Date(peticion.inicio), peticion.duracionMinutos)
}

export async function crearReunionInmediata(peticion: PeticionReunionInmediata): Promise<{ id: string }> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { crearReunionInmediataMock } = await import('./reuniones.mock')
    return crearReunionInmediataMock(peticion)
  }

  const idCaso = await casoDeCliente(peticion.clienteId, peticion.expedienteId)
  return agendar(idCaso, new Date(), 60)
}

/** El motivo no se guarda: `citas` no tiene columna para él. */
export async function cancelarReunion(id: string, motivo: string): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { cancelarReunionMock } = await import('./reuniones.mock')
    return cancelarReunionMock(id, motivo)
  }
  await cambiarEstado(id, 'cancelada')
}

/** Aún no hay proveedor de video en el backend. */
export async function entrarSala(id: string): Promise<AccesoSala> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { entrarSalaMock } = await import('./reuniones.mock')
    return entrarSalaMock(id)
  }
  noDisponible()
}

/** Marca la cita como completada; la duración y el resumen no se guardan todavía. */
export async function finalizarReunion(id: string, peticion: PeticionFinalizarReunion): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { finalizarReunionMock } = await import('./reuniones.mock')
    return finalizarReunionMock(id, peticion)
  }
  await cambiarEstado(id, 'completada')
}

/** `disponibilidad_abogados` existe en la base, pero aún no tiene endpoint. */
export async function obtenerDisponibilidad(): Promise<Disponibilidad> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerDisponibilidadMock } = await import('./reuniones.mock')
    return obtenerDisponibilidadMock()
  }
  noDisponible()
}

export async function guardarDisponibilidad(disponibilidad: Disponibilidad): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { guardarDisponibilidadMock } = await import('./reuniones.mock')
    return guardarDisponibilidadMock(disponibilidad)
  }
  noDisponible()
}
