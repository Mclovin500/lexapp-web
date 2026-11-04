// MOCK: eliminar al conectar el backend
// Datos ficticios en memoria (se reinician al recargar). Aceptar o rechazar lo haría el cliente
// desde su app; aquí esos estados ya vienen en los datos de ejemplo.
import { esperar, haceMinutos, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorApi } from '@/api/errores'
import { buscarClienteMock } from '@/features/clientes/services/clientes.mock'
import { agregarExpedienteMock } from '@/features/expedientes/services/expedientes.mock'
import { tieneMovimientosDePropuestaMock } from '@/features/pagos/services/pagos.mock'
import {
  marcarSolicitudAtendidaMock,
  validarSolicitudDeClienteMock,
} from '@/features/solicitudes/services/solicitudes.mock'
import type {
  FiltroPropuestas,
  FiltrosPropuestas,
  PeticionPropuesta,
  PropuestaDetalle,
  PropuestaResumen,
  RespuestaCrearExpediente,
  RespuestaGuardarPropuesta,
  RespuestaPropuestas,
} from '../types/propuestas.types'

const DIA = 60 * 24

function fechaEnDias(dias: number): string {
  const fecha = new Date(Date.now() + dias * 86_400_000)
  return fecha.toISOString().slice(0, 10)
}

type PropuestaMock = Omit<PropuestaDetalle, 'tieneMovimientos'>

const CONDICIONES =
  'Los honorarios no incluyen gastos de terceros (derechos, peritos o notarios), que se cobrarán por separado con autorización previa del cliente. La propuesta se formaliza cuando el cliente la acepta desde su aplicación.'

const propuestasMock: PropuestaMock[] = [
  {
    id: 'pro-089', folio: 'PRO-2026-089', cliente: { id: 'cli-104', nombre: 'Fernando Garay Luna', organizacion: 'Soluciones Logísticas S.A. de C.V.' },
    servicio: 'Auditoría laboral preventiva', importe: 58000, fechaCreacion: haceMinutos(DIA), fechaVigencia: fechaEnDias(14),
    estado: 'enviada', expedienteId: null,
    solicitud: { id: 'sol-0839', folio: 'SOL-2026-0839', asunto: 'Auditoría laboral preventiva y actualización de contratos' },
    descripcion: 'Revisión integral de contratos individuales, reglamento interior de trabajo y cumplimiento de obligaciones laborales para 120 colaboradores.',
    alcance: 'Diagnóstico de riesgos, informe con recomendaciones y actualización de los formatos de contrato.',
    condiciones: CONDICIONES, tiempoEstimado: '4 semanas',
    conceptos: [{ concepto: 'Anticipo al aceptar', importe: 29000 }, { concepto: 'Entrega del informe final', importe: 29000 }],
    fechaEnvio: haceMinutos(DIA - 30), motivoRechazo: null,
  },
  {
    id: 'pro-088', folio: 'PRO-2026-088', cliente: { id: 'cli-107', nombre: 'Claudia Treviño Garza', organizacion: 'TechHub México S.A.S.' },
    servicio: 'Aviso de privacidad y términos de servicio', importe: 18500, fechaCreacion: haceMinutos(DIA * 5), fechaVigencia: fechaEnDias(-1),
    estado: 'aceptada', expedienteId: 'exp-320',
    solicitud: { id: 'sol-0836', folio: 'SOL-2026-0836', asunto: 'Aviso de privacidad y términos de servicio de plataforma digital' },
    descripcion: 'Redacción del aviso de privacidad integral y de los términos y condiciones de la plataforma conforme a la LFPDPPP.',
    alcance: 'Dos documentos finales y una sesión virtual de revisión con el equipo del cliente.',
    condiciones: CONDICIONES, tiempoEstimado: '2 semanas', conceptos: [], fechaEnvio: haceMinutos(DIA * 5), motivoRechazo: null,
  },
  {
    id: 'pro-087', folio: 'PRO-2026-087', cliente: { id: 'cli-108', nombre: 'Roberto Garza Sada', organizacion: 'Inversiones del Norte' },
    servicio: 'Compraventa de local comercial con fideicomiso', importe: 60000, fechaCreacion: haceMinutos(DIA * 8), fechaVigencia: fechaEnDias(-4),
    estado: 'aceptada', expedienteId: 'exp-305',
    solicitud: { id: 'sol-0835', folio: 'SOL-2026-0835', asunto: 'Compraventa de inmueble comercial y constitución de fideicomiso' },
    descripcion: 'Estructuración de la compraventa mediante fideicomiso de garantía, revisión de títulos y acompañamiento hasta la firma.',
    alcance: 'Estudio de títulos, contrato de fideicomiso y acompañamiento virtual en la firma.',
    condiciones: CONDICIONES, tiempoEstimado: '6 semanas',
    conceptos: [
      { concepto: 'Anticipo', importe: 21000 },
      { concepto: 'Segunda parcialidad', importe: 24000 },
      { concepto: 'Tercera parcialidad al firmar', importe: 15000 },
    ],
    fechaEnvio: haceMinutos(DIA * 8), motivoRechazo: null,
  },
  {
    id: 'pro-086', folio: 'PRO-2026-086', cliente: { id: 'cli-105', nombre: 'Mariana Bosque Ortiz', organizacion: 'BioPharma Lab S.A.' },
    servicio: 'Registro de marca y estrategia de patentes', importe: 42000, fechaCreacion: haceMinutos(DIA * 1.5), fechaVigencia: fechaEnDias(20),
    estado: 'borrador', expedienteId: null,
    solicitud: { id: 'sol-0838', folio: 'SOL-2026-0838', asunto: 'Registro de marca y estrategia de protección de patentes' },
    descripcion: 'Registro de la marca en dos clases y análisis de patentabilidad de la fórmula.',
    alcance: 'Búsqueda fonética, solicitud de registro y opinión de patentabilidad.',
    condiciones: CONDICIONES, tiempoEstimado: '3 meses (trámite ante la autoridad)', conceptos: [], fechaEnvio: null, motivoRechazo: null,
  },
  {
    id: 'pro-085', folio: 'PRO-2026-085', cliente: { id: 'cli-112', nombre: 'Héctor Salinas Ibarra', organizacion: 'Agroexportadora del Pacífico' },
    servicio: 'Defensa ante requerimiento del SAT', importe: 35000, fechaCreacion: haceMinutos(DIA * 4), fechaVigencia: fechaEnDias(3),
    estado: 'rechazada', expedienteId: null,
    solicitud: { id: 'sol-0831', folio: 'SOL-2026-0831', asunto: 'Defensa ante requerimiento del SAT por devolución de IVA' },
    descripcion: 'Atención del requerimiento de información y seguimiento de la devolución de IVA.',
    alcance: 'Escrito de respuesta y seguimiento hasta la resolución.', condiciones: CONDICIONES, tiempoEstimado: '30 días',
    conceptos: [], fechaEnvio: haceMinutos(DIA * 4), motivoRechazo: 'El importe excede el presupuesto que teníamos previsto.',
  },
  {
    id: 'pro-084', folio: 'PRO-2026-084', cliente: { id: 'cli-111', nombre: 'Lucía Hernández Prado', organizacion: null },
    servicio: 'Juicio por incumplimiento de arrendamiento', importe: 12000, fechaCreacion: haceMinutos(DIA * 6), fechaVigencia: fechaEnDias(8),
    estado: 'cancelada', expedienteId: null, solicitud: null,
    descripcion: 'Demanda de terminación de contrato y pago de rentas adeudadas.', alcance: 'Primera instancia.',
    condiciones: CONDICIONES, tiempoEstimado: '4 a 6 meses', conceptos: [], fechaEnvio: haceMinutos(DIA * 6), motivoRechazo: null,
  },
  {
    id: 'pro-083', folio: 'PRO-2026-083', cliente: { id: 'cli-110', nombre: 'Jorge Villaseñor Cano', organizacion: 'Constructora del Bajío' },
    servicio: 'Juicio de amparo contra multa municipal', importe: 30000, fechaCreacion: haceMinutos(DIA * 12), fechaVigencia: fechaEnDias(-6),
    estado: 'aceptada', expedienteId: 'exp-312',
    solicitud: { id: 'sol-0833', folio: 'SOL-2026-0833', asunto: 'Recurso contra multa municipal por licencia de construcción' },
    descripcion: 'Promoción del juicio de amparo indirecto y solicitud de suspensión.', alcance: 'Primera instancia del amparo.',
    condiciones: CONDICIONES, tiempoEstimado: '3 a 5 meses', conceptos: [], fechaEnvio: haceMinutos(DIA * 12), motivoRechazo: null,
  },
  {
    id: 'pro-082', folio: 'PRO-2026-082', cliente: { id: 'cli-103', nombre: 'Elena Santillán Ruiz', organizacion: null },
    servicio: 'Negociación de liquidación laboral', importe: 16000, fechaCreacion: haceMinutos(DIA * 2), fechaVigencia: fechaEnDias(5),
    estado: 'pendiente_respuesta', expedienteId: null, solicitud: null,
    descripcion: 'Revisión de la liquidación ofrecida y negociación con la empresa.', alcance: 'Hasta la firma del convenio de terminación.',
    condiciones: CONDICIONES, tiempoEstimado: '3 semanas', conceptos: [], fechaEnvio: haceMinutos(DIA * 2), motivoRechazo: null,
  },
  {
    id: 'pro-081', folio: 'PRO-2026-081', cliente: { id: 'cli-113', nombre: 'Mariana Torreblanca Ríos', organizacion: 'Torreblanca Consultores S.C.' },
    servicio: 'Auditoría corporativa anual', importe: 26000, fechaCreacion: haceMinutos(DIA * 3), fechaVigencia: fechaEnDias(10),
    estado: 'aceptada', expedienteId: null, solicitud: null,
    descripcion: 'Revisión de libros corporativos, actas y poderes vigentes.', alcance: 'Informe con hallazgos y actas de regularización.',
    condiciones: CONDICIONES, tiempoEstimado: '5 semanas', conceptos: [], fechaEnvio: haceMinutos(DIA * 3), motivoRechazo: null,
  },
]

let consecutivo = 90
let consecutivoExpediente = 330

async function simularRed(): Promise<void> {
  await esperar()
  if (SIMULAR_ERROR_RED) throw new ErrorApi('red')
}

function buscar(id: string): PropuestaMock {
  const propuesta = propuestasMock.find((p) => p.id === id)
  if (!propuesta) throw new ErrorApi('no_encontrado')
  return propuesta
}

function aResumen(p: PropuestaMock): PropuestaResumen {
  const { id, folio, cliente, servicio, importe, fechaCreacion, fechaVigencia, estado, expedienteId } = p
  return { id, folio, cliente: { ...cliente }, servicio, importe, fechaCreacion, fechaVigencia, estado, expedienteId }
}

function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

/** Para el indicador "Propuestas pendientes" del Dashboard. */
export function contarPropuestasPendientesMock(): number {
  return propuestasMock.filter((p) => p.estado === 'enviada' || p.estado === 'pendiente_respuesta').length
}

export async function listarPropuestasMock(filtros: FiltrosPropuestas): Promise<RespuestaPropuestas> {
  await simularRed()
  const busqueda = normalizar(filtros.busqueda.trim())
  const base = propuestasMock.filter(
    (p) => !busqueda || normalizar(`${p.cliente.nombre} ${p.cliente.organizacion ?? ''} ${p.servicio} ${p.folio}`).includes(busqueda),
  )
  const contar = (estado: FiltroPropuestas) => (estado === 'todas' ? base.length : base.filter((p) => p.estado === estado).length)
  const filtradas = base
    .filter((p) => filtros.estado === 'todas' || p.estado === filtros.estado)
    .sort((a, b) => b.fechaCreacion.localeCompare(a.fechaCreacion))
  const inicio = (filtros.pagina - 1) * filtros.porPagina

  return {
    propuestas: filtradas.slice(inicio, inicio + filtros.porPagina).map(aResumen),
    total: filtradas.length,
    totalesPorEstado: {
      todas: contar('todas'), borrador: contar('borrador'), enviada: contar('enviada'),
      pendiente_respuesta: contar('pendiente_respuesta'), aceptada: contar('aceptada'),
      rechazada: contar('rechazada'), cancelada: contar('cancelada'),
    },
  }
}

export async function obtenerPropuestaMock(id: string): Promise<PropuestaDetalle> {
  await simularRed()
  const propuesta = buscar(id)
  return {
    ...propuesta,
    cliente: { ...propuesta.cliente },
    conceptos: propuesta.conceptos.map((c) => ({ ...c })),
    tieneMovimientos: tieneMovimientosDePropuestaMock(id),
  }
}

function aplicar(propuesta: PropuestaMock, peticion: PeticionPropuesta): void {
  const cliente = buscarClienteMock(peticion.clienteId)
  const solicitud = peticion.solicitudId ? validarSolicitudDeClienteMock(peticion.solicitudId, cliente.id) : null
  const suma = peticion.conceptos.reduce((total, c) => total + c.importe, 0)
  if (peticion.conceptos.length > 0 && Math.abs(suma - peticion.honorarios) > 0.001) throw new ErrorApi('datos_invalidos')

  Object.assign(propuesta, {
    cliente: { id: cliente.id, nombre: cliente.nombre, organizacion: cliente.organizacion },
    solicitud,
    servicio: peticion.servicio,
    descripcion: peticion.descripcion,
    alcance: peticion.alcance,
    importe: peticion.honorarios,
    conceptos: peticion.conceptos.map((c) => ({ ...c })),
    condiciones: peticion.condiciones,
    tiempoEstimado: peticion.tiempoEstimado,
    fechaVigencia: peticion.fechaVigencia,
  })

  if (peticion.accion === 'enviar') {
    propuesta.estado = 'enviada'
    propuesta.fechaEnvio = new Date().toISOString()
    if (solicitud) marcarSolicitudAtendidaMock(solicitud.id)
  }
}

export async function crearPropuestaMock(peticion: PeticionPropuesta): Promise<RespuestaGuardarPropuesta> {
  await simularRed()
  const propuesta: PropuestaMock = {
    id: `pro-0${consecutivo}`, folio: `PRO-2026-0${consecutivo}`,
    cliente: { id: '', nombre: '', organizacion: null }, servicio: '', importe: 0,
    fechaCreacion: new Date().toISOString(), fechaVigencia: '', estado: 'borrador', expedienteId: null,
    solicitud: null, descripcion: '', alcance: '', condiciones: '', tiempoEstimado: '', conceptos: [],
    fechaEnvio: null, motivoRechazo: null,
  }
  aplicar(propuesta, peticion)
  propuestasMock.push(propuesta)
  consecutivo += 1
  return { id: propuesta.id, estado: propuesta.estado }
}

/** Solo se editan borradores (409 en otro estado). */
export async function actualizarPropuestaMock(id: string, peticion: PeticionPropuesta): Promise<RespuestaGuardarPropuesta> {
  await simularRed()
  const propuesta = buscar(id)
  if (propuesta.estado !== 'borrador') throw new ErrorApi('conflicto')
  aplicar(propuesta, peticion)
  return { id: propuesta.id, estado: propuesta.estado }
}

/** Se cancela un borrador o una propuesta enviada que el cliente aún no responde. */
export async function cancelarPropuestaMock(id: string): Promise<void> {
  await simularRed()
  const propuesta = buscar(id)
  if (!['borrador', 'enviada', 'pendiente_respuesta'].includes(propuesta.estado)) throw new ErrorApi('conflicto')
  propuesta.estado = 'cancelada'
}

/** Flujo 6.6: propuesta aceptada → se crea o habilita el expediente. */
export async function crearExpedienteMock(id: string): Promise<RespuestaCrearExpediente> {
  await simularRed()
  const propuesta = buscar(id)
  if (propuesta.estado !== 'aceptada') throw new ErrorApi('conflicto')
  if (propuesta.expedienteId) return { expedienteId: propuesta.expedienteId }

  const expedienteId = `exp-${consecutivoExpediente}`
  agregarExpedienteMock({
    id: expedienteId,
    folio: `Exp. ${consecutivoExpediente}/2026`,
    asunto: propuesta.servicio,
    clienteId: propuesta.cliente.id,
  })
  consecutivoExpediente += 1
  propuesta.expedienteId = expedienteId
  return { expedienteId }
}
