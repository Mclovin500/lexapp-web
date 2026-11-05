// MOCK: eliminar al conectar el backend
// Reuniones virtuales ficticias (regla 9.2) para G1, G1A, B1, E2 y H1. Fechas relativas al cargar la página.
import { enMinutos, esperar, haceMinutos, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorApi } from '@/api/errores'
import { buscarClienteMock, buscarContactoMock } from '@/features/clientes/services/clientes.mock'
import type { ReunionProxima } from '@/features/dashboard/types/dashboard.types'
import {
  AUTOR_ABOGADO_MOCK,
  expedientesMock,
  registrarEventoExpedienteMock,
} from '@/features/expedientes/services/expedientes.mock'
import type {
  AccesoSala,
  Disponibilidad,
  EstadoReunion,
  FiltrosReuniones,
  OrigenReunion,
  PeticionFinalizarReunion,
  PeticionReunion,
  PeticionReunionInmediata,
  ReunionDetalle,
  ReunionResumen,
} from '../types/agenda.types'

/** Reunión de otro abogado: para probar el control de acceso (403). */
export const REUNION_AJENA_MOCK = 'reu-999'
/** La sala abre 60 min antes del inicio y cierra 30 min después del fin. */
const ABRE_ANTES_MIN = 60
const CIERRA_DESPUES_MIN = 30
const DIA = 60 * 24

interface ReunionMock {
  id: string
  titulo: string
  clienteId: string
  expedienteId: string | null
  inicio: string
  fin: string
  /** Estado guardado; `en_curso` y `no_realizada` también se calculan por la hora. */
  estado: EstadoReunion
  notas: string | null
  origen: OrigenReunion
  motivoCancelacion: string | null
  duracionRealSegundos: number | null
  resumen: string | null
  historial: ReunionDetalle['historial']
}

function reunion(
  id: string, titulo: string, clienteId: string, expedienteId: string | null, minutos: number, duracion: number,
  extra: Partial<ReunionMock> = {},
): ReunionMock {
  const inicio = minutos >= 0 ? enMinutos(minutos) : haceMinutos(-minutos)
  return {
    id, titulo, clienteId, expedienteId, inicio,
    fin: new Date(Date.parse(inicio) + duracion * 60_000).toISOString(),
    estado: 'programada', notas: null, origen: 'agenda', motivoCancelacion: null, duracionRealSegundos: null, resumen: null,
    historial: [{ estado: 'programada', fecha: haceMinutos(DIA * 3), nota: null }],
    ...extra,
  }
}

const reunionesMock: ReunionMock[] = [
  reunion('reu-300', 'Revisión del convenio de terminación', 'cli-103', 'exp-298', -10, 45, { notas: 'Revisar las cláusulas de no competencia y el monto de la liquidación.' }),
  reunion('reu-301', 'Seguimiento de compraventa', 'cli-108', 'exp-305', 45, 45, { notas: 'Comentarios del cliente al proyecto de contrato de fideicomiso.' }),
  reunion('reu-302', 'Seguimiento del registro de marca', 'cli-105', 'exp-282', 240, 30),
  reunion('reu-303', 'Revisión de avances del amparo', 'cli-110', 'exp-312', 60 * 26, 60, { notas: 'Explicar al cliente la suspensión provisional.' }),
  reunion('reu-304', 'Firma del convenio de terminación', 'cli-103', 'exp-298', DIA * 3, 30, { origen: 'cliente' }),
  reunion('reu-305', 'Estrategia probatoria', 'cli-102', 'exp-290', DIA * 6 + 120, 60),
  reunion('reu-290', 'Preparación de la demanda de amparo', 'cli-110', 'exp-312', -DIA * 2, 60, {
    estado: 'finalizada', duracionRealSegundos: 52 * 60, resumen: 'Se revisaron las pruebas y se acordó presentar la demanda esta semana.',
  }),
  reunion('reu-291', 'Revisión de títulos del local', 'cli-108', 'exp-305', -DIA * 5, 45, { estado: 'finalizada', duracionRealSegundos: 38 * 60, resumen: null }),
  reunion('reu-292', 'Inventario de datos personales', 'cli-107', 'exp-320', -DIA * 3 - 90, 30, {
    estado: 'cancelada', motivoCancelacion: 'El cliente pidió cambiar la fecha.',
  }),
  reunion('reu-293', 'Cierre del convenio laboral', 'cli-104', 'exp-275', -DIA * 12, 45, { estado: 'finalizada', duracionRealSegundos: 41 * 60, resumen: 'Convenio firmado; asunto concluido.' }),
]

let disponibilidad: Disponibilidad = {
  dias: [0, 1, 2, 3, 4, 5, 6].map((dia) => ({ dia, activo: dia >= 1 && dia <= 5, inicio: '09:00', fin: dia === 5 ? '14:00' : '18:00' })),
  duracionMinutos: 45,
  margenMinutos: 15,
}

let consecutivo = 310

async function simularRed(milisegundos?: number): Promise<void> {
  await esperar(milisegundos)
  if (SIMULAR_ERROR_RED) throw new ErrorApi('red')
}

function ventana(r: ReunionMock): { abre: number; cierra: number } {
  return { abre: Date.parse(r.inicio) - ABRE_ANTES_MIN * 60_000, cierra: Date.parse(r.fin) + CIERRA_DESPUES_MIN * 60_000 }
}

function estadoActual(r: ReunionMock, ahora = Date.now()): EstadoReunion {
  if (r.estado !== 'programada') return r.estado
  if (ahora < Date.parse(r.inicio)) return 'programada'
  return ahora <= ventana(r).cierra ? 'en_curso' : 'no_realizada'
}

function aResumen(r: ReunionMock): ReunionResumen {
  const contacto = buscarContactoMock(r.clienteId)
  const expediente = expedientesMock.find((e) => e.id === r.expedienteId)
  return {
    id: r.id,
    titulo: r.titulo,
    cliente: { id: contacto.id, nombre: contacto.nombre },
    expediente: expediente ? { id: expediente.id, folio: expediente.folio } : null,
    inicio: r.inicio,
    fin: r.fin,
    estado: estadoActual(r),
  }
}

function aDetalle(r: ReunionMock): ReunionDetalle {
  const contacto = buscarContactoMock(r.clienteId)
  const { abre, cierra } = ventana(r)
  return {
    ...aResumen(r),
    cliente: { id: contacto.id, nombre: contacto.nombre, organizacion: contacto.organizacion, enDirectorio: contacto.enDirectorio },
    notas: r.notas,
    origen: r.origen,
    sala: { abreEn: new Date(abre).toISOString(), cierraEn: new Date(cierra).toISOString() },
    motivoCancelacion: r.motivoCancelacion,
    duracionRealSegundos: r.duracionRealSegundos,
    resumen: r.resumen,
    historial: r.historial.map((h) => ({ ...h })),
  }
}

function buscar(id: string): ReunionMock {
  if (id === REUNION_AJENA_MOCK) throw new ErrorApi('sin_permiso')
  const r = reunionesMock.find((x) => x.id === id)
  if (!r) throw new ErrorApi('no_encontrado')
  return r
}

const ABIERTAS: EstadoReunion[] = ['programada', 'en_curso']
const porInicio = (a: ReunionMock, b: ReunionMock) => a.inicio.localeCompare(b.inicio)

/** Próximas reuniones para B1 y E2. */
export function proximasReunionesMock(filtro: { expedienteId?: string; clienteId?: string; limite?: number } = {}): ReunionProxima[] {
  return reunionesMock
    .filter(
      (r) =>
        ABIERTAS.includes(estadoActual(r)) &&
        (!filtro.expedienteId || r.expedienteId === filtro.expedienteId) &&
        (!filtro.clienteId || r.clienteId === filtro.clienteId),
    )
    .sort(porInicio)
    .slice(0, filtro.limite ?? reunionesMock.length)
    .map((r) => {
      const resumen = aResumen(r)
      return { id: r.id, titulo: r.titulo, cliente: resumen.cliente.nombre, inicio: r.inicio, fin: r.fin, expediente: resumen.expediente?.folio ?? null }
    })
}

export async function listarReunionesMock(filtros: FiltrosReuniones): Promise<ReunionResumen[]> {
  await simularRed(400)
  let lista = [...reunionesMock]
  if (filtros.desde) lista = lista.filter((r) => r.inicio >= (filtros.desde ?? ''))
  if (filtros.hasta) lista = lista.filter((r) => r.inicio < (filtros.hasta ?? ''))
  if (filtros.alcance === 'proximas') lista = lista.filter((r) => ABIERTAS.includes(estadoActual(r))).sort(porInicio)
  else if (filtros.alcance === 'historial') lista = lista.filter((r) => !ABIERTAS.includes(estadoActual(r))).sort((a, b) => b.inicio.localeCompare(a.inicio))
  else lista.sort(porInicio)
  return lista.slice(0, filtros.limite ?? lista.length).map(aResumen)
}

export async function obtenerReunionMock(id: string): Promise<ReunionDetalle> {
  await simularRed(400)
  return aDetalle(buscar(id))
}

function validarExpediente(clienteId: string, expedienteId: string | null): void {
  if (!expedienteId) return
  const expediente = expedientesMock.find((e) => e.id === expedienteId)
  if (!expediente || expediente.clienteId !== clienteId) throw new ErrorApi('datos_invalidos')
  if (expediente.estado === 'finalizado') throw new ErrorApi('conflicto')
}

function seTraslapa(inicio: number, fin: number): boolean {
  return reunionesMock.some((r) => ABIERTAS.includes(estadoActual(r)) && Date.parse(r.inicio) < fin && Date.parse(r.fin) > inicio)
}

function registrar(datos: Pick<ReunionMock, 'titulo' | 'clienteId' | 'expedienteId' | 'inicio' | 'fin' | 'notas' | 'origen'>): ReunionMock {
  const nueva: ReunionMock = {
    id: `reu-${consecutivo++}`,
    ...datos,
    estado: 'programada',
    motivoCancelacion: null,
    duracionRealSegundos: null,
    resumen: null,
    historial: [{ estado: 'programada', fecha: new Date().toISOString(), nota: null }],
  }
  reunionesMock.push(nueva)
  if (nueva.expedienteId) {
    registrarEventoExpedienteMock(nueva.expedienteId, 'reunion', `Se programó la reunión virtual "${nueva.titulo}".`, AUTOR_ABOGADO_MOCK)
  }
  return nueva
}

/** G1 "Programar reunión": 422 si los datos no son válidos, 409 si choca con otra reunión. */
export async function programarReunionMock(peticion: PeticionReunion): Promise<{ id: string }> {
  await simularRed()
  buscarClienteMock(peticion.clienteId)
  validarExpediente(peticion.clienteId, peticion.expedienteId)
  const inicio = Date.parse(peticion.inicio)
  if (Number.isNaN(inicio) || inicio <= Date.now()) throw new ErrorApi('datos_invalidos')
  const fin = inicio + peticion.duracionMinutos * 60_000
  if (seTraslapa(inicio, fin)) throw new ErrorApi('conflicto')
  const nueva = registrar({
    titulo: peticion.titulo,
    clienteId: peticion.clienteId,
    expedienteId: peticion.expedienteId,
    inicio: new Date(inicio).toISOString(),
    fin: new Date(fin).toISOString(),
    notas: peticion.notas || null,
    origen: 'agenda',
  })
  return { id: nueva.id }
}

/** H1 "Videollamada": usa la reunión del cliente con la sala abierta o crea una inmediata de 45 min. */
export async function crearReunionInmediataMock(peticion: PeticionReunionInmediata): Promise<{ id: string }> {
  await simularRed(500)
  const contacto = buscarContactoMock(peticion.clienteId)
  validarExpediente(peticion.clienteId, peticion.expedienteId)
  const ahora = Date.now()
  const abierta = reunionesMock.find((r) => {
    const { abre, cierra } = ventana(r)
    return r.clienteId === contacto.id && r.expedienteId === peticion.expedienteId && ABIERTAS.includes(estadoActual(r)) && abre <= ahora && ahora <= cierra
  })
  if (abierta) return { id: abierta.id }
  const nueva = registrar({
    titulo: `Videollamada con ${contacto.nombre}`,
    clienteId: contacto.id,
    expedienteId: peticion.expedienteId,
    inicio: new Date(ahora).toISOString(),
    fin: new Date(ahora + 45 * 60_000).toISOString(),
    notas: null,
    origen: 'chat',
  })
  return { id: nueva.id }
}

export async function cancelarReunionMock(id: string, motivo: string): Promise<void> {
  await simularRed(500)
  const r = buscar(id)
  if (r.estado !== 'programada' || estadoActual(r) === 'no_realizada') throw new ErrorApi('conflicto')
  r.estado = 'cancelada'
  r.motivoCancelacion = motivo
  r.historial.push({ estado: 'cancelada', fecha: new Date().toISOString(), nota: motivo })
}

/** G1A: entrega la credencial de la sala solo dentro de la ventana y si la reunión sigue abierta. */
export async function entrarSalaMock(id: string): Promise<AccesoSala> {
  await simularRed(600)
  const r = buscar(id)
  const { abre, cierra } = ventana(r)
  const ahora = Date.now()
  if (!ABIERTAS.includes(estadoActual(r)) || ahora < abre || ahora > cierra) throw new ErrorApi('conflicto')
  if (r.estado !== 'en_curso') {
    r.estado = 'en_curso'
    r.historial.push({ estado: 'en_curso', fecha: new Date().toISOString(), nota: 'El abogado entró a la sala.' })
  }
  return { proveedor: 'simulado', sala: `sala-${r.id}`, token: 'token-simulado', expiraEn: new Date(cierra).toISOString() }
}

export async function finalizarReunionMock(id: string, peticion: PeticionFinalizarReunion): Promise<void> {
  await simularRed(500)
  const r = buscar(id)
  if (r.estado !== 'en_curso') throw new ErrorApi('conflicto')
  r.estado = 'finalizada'
  r.duracionRealSegundos = peticion.duracionSegundos
  r.resumen = peticion.resumen || null
  r.historial.push({ estado: 'finalizada', fecha: new Date().toISOString(), nota: null })
  if (r.expedienteId) {
    const minutos = Math.max(1, Math.round(peticion.duracionSegundos / 60))
    registrarEventoExpedienteMock(
      r.expedienteId,
      'reunion',
      `Se realizó la reunión virtual "${r.titulo}" (${minutos} min).${r.resumen ? ` Resumen: ${r.resumen}` : ''}`,
      AUTOR_ABOGADO_MOCK,
    )
  }
}

export async function obtenerDisponibilidadMock(): Promise<Disponibilidad> {
  await simularRed(300)
  return { ...disponibilidad, dias: disponibilidad.dias.map((d) => ({ ...d })) }
}

export async function guardarDisponibilidadMock(nueva: Disponibilidad): Promise<void> {
  await simularRed(500)
  const valida = nueva.dias.some((d) => d.activo) && nueva.dias.every((d) => !d.activo || d.inicio < d.fin)
  if (!valida) throw new ErrorApi('datos_invalidos')
  disponibilidad = { ...nueva, dias: nueva.dias.map((d) => ({ ...d })) }
}
