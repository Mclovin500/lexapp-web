// MOCK: eliminar al conectar el backend
// Datos ficticios en memoria (se reinician al recargar). Los estados los cambiaría la
// pasarela de pagos; aquí solo cambian al crear un cobro (queda "pendiente").
import { enMinutos, esperar, haceMinutos, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorApi } from '@/api/errores'
import { buscarClienteMock } from '@/features/clientes/services/clientes.mock'
import { buscarExpedienteMock } from '@/features/expedientes/services/expedientes.mock'
import type {
  CambioEstadoMovimiento,
  EstadoMovimiento,
  FiltroMovimientos,
  FiltrosMovimientos,
  MovimientoDetalle,
  MovimientoResumen,
  PeticionCobroAdicional,
  RespuestaCobroAdicional,
  RespuestaMovimientos,
  ResumenHonorarios,
} from '../types/pagos.types'

function paso(estado: EstadoMovimiento, minutosAtras: number, nota: string | null = null): CambioEstadoMovimiento {
  return { estado, fecha: haceMinutos(minutosAtras), nota }
}

const DIA = 60 * 24

const movimientosMock: MovimientoDetalle[] = [
  {
    id: 'mov-560', folio: 'MOV-2026-0560', cliente: { id: 'cli-108', nombre: 'Roberto Garza Sada' },
    expediente: { id: 'exp-305', folio: 'Exp. 305/2026' }, concepto: 'Segunda parcialidad de honorarios', importe: 24000,
    fecha: haceMinutos(90), estado: 'en_proceso', origen: 'propuesta', propuestaId: 'pro-087',
    descripcion: 'Segunda de tres parcialidades acordadas en la propuesta PRO-2026-087.', fechaLimite: null, fechaPago: haceMinutos(20),
    metodoPago: 'Transferencia SPEI', referenciaTransaccion: 'PAG-77291048',
    historial: [paso('pendiente', 90, 'Cobro generado'), paso('en_proceso', 20, 'El cliente realizó el pago; la pasarela lo está confirmando')],
  },
  {
    id: 'mov-551', folio: 'MOV-2026-0551', cliente: { id: 'cli-102', nombre: 'Carlos Mendoza Prieto' },
    expediente: { id: 'exp-290', folio: 'Exp. 290/2026' }, concepto: 'Anticipo de honorarios', importe: 45000,
    fecha: haceMinutos(DIA * 2), estado: 'pagado', origen: 'cobro_adicional', propuestaId: null,
    descripcion: 'Anticipo para iniciar el juicio reivindicatorio.', fechaLimite: null, fechaPago: haceMinutos(65),
    metodoPago: 'Tarjeta •••• 4912', referenciaTransaccion: 'PAG-77180332',
    historial: [paso('pendiente', DIA * 2, 'Cobro enviado al cliente'), paso('en_proceso', 70), paso('pagado', 65, 'Pago confirmado por la pasarela')],
  },
  {
    id: 'mov-545', folio: 'MOV-2026-0545', cliente: { id: 'cli-107', nombre: 'Claudia Treviño Garza' },
    expediente: { id: 'exp-320', folio: 'Exp. 320/2026' }, concepto: 'Honorarios: aviso de privacidad y términos', importe: 18500,
    fecha: haceMinutos(DIA * 3), estado: 'retenido', origen: 'propuesta', propuestaId: 'pro-088',
    descripcion: 'Pago total de la propuesta aceptada; se libera al entregar los documentos.', fechaLimite: null, fechaPago: haceMinutos(DIA * 2),
    metodoPago: 'Transferencia SPEI', referenciaTransaccion: 'PAG-77012876',
    historial: [paso('pendiente', DIA * 3), paso('pagado', DIA * 2, 'Pago confirmado'), paso('retenido', DIA * 2 - 5, 'Fondos retenidos hasta la entrega del servicio')],
  },
  {
    id: 'mov-540', folio: 'MOV-2026-0540', cliente: { id: 'cli-110', nombre: 'Jorge Villaseñor Cano' },
    expediente: { id: 'exp-312', folio: 'Exp. 312/2026' }, concepto: 'Cobro adicional: gastos de peritaje', importe: 12800,
    fecha: haceMinutos(DIA * 3), estado: 'pendiente', origen: 'cobro_adicional', propuestaId: null,
    descripcion: 'Honorarios del perito en topografía designado en el juicio.', fechaLimite: enMinutos(DIA * 4), fechaPago: null,
    metodoPago: null, referenciaTransaccion: null,
    historial: [paso('pendiente', DIA * 3, 'Cobro enviado al cliente')],
  },
  {
    id: 'mov-538', folio: 'MOV-2026-0538', cliente: { id: 'cli-110', nombre: 'Jorge Villaseñor Cano' },
    expediente: { id: 'exp-312', folio: 'Exp. 312/2026' }, concepto: 'Honorarios: presentación de la demanda de amparo', importe: 30000,
    fecha: haceMinutos(DIA * 9), estado: 'liberado', origen: 'propuesta', propuestaId: 'pro-083',
    descripcion: null, fechaLimite: null, fechaPago: haceMinutos(DIA * 8),
    metodoPago: 'Transferencia SPEI', referenciaTransaccion: 'PAG-76544120',
    historial: [paso('pendiente', DIA * 9), paso('pagado', DIA * 8), paso('retenido', DIA * 8 - 5), paso('liberado', DIA * 2, 'Fondos liberados a tu cuenta de depósito')],
  },
  {
    id: 'mov-532', folio: 'MOV-2026-0532', cliente: { id: 'cli-107', nombre: 'Claudia Treviño Garza' },
    expediente: { id: 'exp-320', folio: 'Exp. 320/2026' }, concepto: 'Cobro adicional: registro ante autoridad', importe: 9250,
    fecha: haceMinutos(DIA * 6), estado: 'rechazado', origen: 'cobro_adicional', propuestaId: null,
    descripcion: 'Derechos de registro ante la autoridad competente.', fechaLimite: null, fechaPago: null,
    metodoPago: 'Tarjeta •••• 0087', referenciaTransaccion: 'PAG-76801455',
    historial: [paso('pendiente', DIA * 6), paso('en_proceso', DIA * 5), paso('rechazado', DIA * 5 - 3, 'El banco del cliente rechazó el pago')],
  },
  {
    id: 'mov-530', folio: 'MOV-2026-0530', cliente: { id: 'cli-103', nombre: 'Elena Santillán Ruiz' },
    expediente: { id: 'exp-298', folio: 'Exp. 298/2026' }, concepto: 'Consulta y análisis de liquidación', importe: 8000,
    fecha: haceMinutos(DIA * 10), estado: 'pagado', origen: 'cobro_adicional', propuestaId: null,
    descripcion: null, fechaLimite: null, fechaPago: haceMinutos(DIA * 9),
    metodoPago: 'Tarjeta •••• 3301', referenciaTransaccion: 'PAG-76420019',
    historial: [paso('pendiente', DIA * 10), paso('pagado', DIA * 9)],
  },
  {
    id: 'mov-525', folio: 'MOV-2026-0525', cliente: { id: 'cli-108', nombre: 'Roberto Garza Sada' },
    expediente: { id: 'exp-305', folio: 'Exp. 305/2026' }, concepto: 'Tercera parcialidad de honorarios', importe: 15000,
    fecha: haceMinutos(DIA * 1), estado: 'pendiente', origen: 'propuesta', propuestaId: 'pro-087',
    descripcion: 'Última parcialidad, pagadera al firmar la escritura.', fechaLimite: enMinutos(DIA * 20), fechaPago: null,
    metodoPago: null, referenciaTransaccion: null,
    historial: [paso('pendiente', DIA * 1)],
  },
  {
    id: 'mov-520', folio: 'MOV-2026-0520', cliente: { id: 'cli-102', nombre: 'Carlos Mendoza Prieto' },
    expediente: { id: 'exp-290', folio: 'Exp. 290/2026' }, concepto: 'Honorarios: estudio de títulos', importe: 20000,
    fecha: haceMinutos(DIA * 15), estado: 'liberado', origen: 'cobro_adicional', propuestaId: null,
    descripcion: null, fechaLimite: null, fechaPago: haceMinutos(DIA * 14),
    metodoPago: 'Transferencia SPEI', referenciaTransaccion: 'PAG-75990210',
    historial: [paso('pendiente', DIA * 15), paso('pagado', DIA * 14), paso('liberado', DIA * 12)],
  },
]

let consecutivo = 561

async function simularRed(): Promise<void> {
  await esperar()
  if (SIMULAR_ERROR_RED) throw new ErrorApi('red')
}

function aResumen(m: MovimientoDetalle): MovimientoResumen {
  const { id, folio, cliente, expediente, concepto, importe, fecha, estado, origen, propuestaId } = m
  return { id, folio, cliente: { ...cliente }, expediente: expediente && { ...expediente }, concepto, importe, fecha, estado, origen, propuestaId }
}

function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

const porFechaDesc = (a: MovimientoDetalle, b: MovimientoDetalle) => b.fecha.localeCompare(a.fecha)

function sumar(estados: EstadoMovimiento[]): number {
  return movimientosMock.filter((m) => estados.includes(m.estado)).reduce((total, m) => total + m.importe, 0)
}

/** D2: indica si la propuesta tiene movimientos para enlazar a D3. */
export function tieneMovimientosDePropuestaMock(propuestaId: string): boolean {
  return movimientosMock.some((m) => m.propuestaId === propuestaId)
}

/** Para "Pagos y cobros relevantes" del Dashboard. */
export function movimientosRecientesMock(limite: number): MovimientoResumen[] {
  return [...movimientosMock].sort(porFechaDesc).slice(0, limite).map(aResumen)
}

export async function obtenerResumenHonorariosMock(): Promise<ResumenHonorarios> {
  await simularRed()
  return {
    ingresosTotales: sumar(['pagado', 'retenido', 'liberado']),
    pagosPendientes: sumar(['pendiente']),
    pagosRecibidos: sumar(['pagado']),
    fondosRetenidos: sumar(['retenido']),
    fondosLiberados: sumar(['liberado']),
  }
}

export async function listarMovimientosMock(filtros: FiltrosMovimientos): Promise<RespuestaMovimientos> {
  await simularRed()
  const busqueda = normalizar(filtros.busqueda.trim())
  const base = movimientosMock.filter(
    (m) =>
      (!filtros.propuestaId || m.propuestaId === filtros.propuestaId) &&
      (!busqueda || normalizar(`${m.cliente.nombre} ${m.expediente?.folio ?? ''} ${m.concepto} ${m.folio}`).includes(busqueda)),
  )
  const contar = (estado: FiltroMovimientos) => (estado === 'todos' ? base.length : base.filter((m) => m.estado === estado).length)
  const filtrados = base.filter((m) => filtros.estado === 'todos' || m.estado === filtros.estado).sort(porFechaDesc)
  const inicio = (filtros.pagina - 1) * filtros.porPagina

  return {
    movimientos: filtrados.slice(inicio, inicio + filtros.porPagina).map(aResumen),
    total: filtrados.length,
    totalesPorEstado: {
      todos: contar('todos'), pendiente: contar('pendiente'), pagado: contar('pagado'), en_proceso: contar('en_proceso'),
      rechazado: contar('rechazado'), retenido: contar('retenido'), liberado: contar('liberado'),
    },
  }
}

export async function obtenerMovimientoMock(id: string): Promise<MovimientoDetalle> {
  await simularRed()
  const movimiento = movimientosMock.find((m) => m.id === id)
  if (!movimiento) throw new ErrorApi('no_encontrado')
  return { ...aResumen(movimiento), ...movimiento, historial: movimiento.historial.map((h) => ({ ...h })) }
}

/** D4: registra el cobro, lo asocia al expediente y queda "pendiente" hasta que el cliente pague en su app. */
export async function crearCobroAdicionalMock(peticion: PeticionCobroAdicional): Promise<RespuestaCobroAdicional> {
  await simularRed()
  const cliente = buscarClienteMock(peticion.clienteId)
  const expediente = buscarExpedienteMock(peticion.expedienteId)
  if (expediente.clienteId !== cliente.id) throw new ErrorApi('datos_invalidos')

  const id = `mov-${consecutivo}`
  const ahora = new Date().toISOString()
  movimientosMock.push({
    id,
    folio: `MOV-2026-0${consecutivo}`,
    cliente: { id: cliente.id, nombre: cliente.nombre },
    expediente: { id: expediente.id, folio: expediente.folio },
    concepto: peticion.concepto,
    importe: peticion.importe,
    fecha: ahora,
    estado: 'pendiente',
    origen: 'cobro_adicional',
    propuestaId: null,
    descripcion: peticion.descripcion,
    fechaLimite: peticion.fechaLimite ? `${peticion.fechaLimite}T23:59:00` : null,
    fechaPago: null,
    metodoPago: null,
    referenciaTransaccion: null,
    historial: [{ estado: 'pendiente', fecha: ahora, nota: 'Cobro enviado al cliente. Lo pagará desde su aplicación.' }],
  })
  consecutivo += 1
  return { id }
}
