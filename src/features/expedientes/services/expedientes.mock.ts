// MOCK: eliminar al conectar el backend
// Datos base de los expedientes. El detalle (E2) los combina con documentos, pagos y
// reuniones en `expediente-detalle.mock.ts` para evitar importaciones circulares.
import { esperar, haceMinutos, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorApi } from '@/api/errores'
import { clientesMock } from '@/features/clientes/services/clientes.mock'
import type {
  ActualizacionExpediente,
  EstadoExpediente,
  EventoExpediente,
  ExpedienteResumen,
  FiltroExpedientes,
  FiltrosExpedientes,
  OpcionExpediente,
  PeticionActualizacion,
  PeticionCambioEstado,
  RespuestaExpedientes,
  TipoEventoExpediente,
} from '../types/expedientes.types'

export const AUTOR_ABOGADO_MOCK = 'Lic. Alejandro Morales Vega'
/** Expediente de otro abogado: sirve para probar el control de acceso (403). */
export const EXPEDIENTE_AJENO_MOCK = 'exp-999'

const DIA = 60 * 24

export interface ExpedienteRegistroMock extends OpcionExpediente {
  areaJuridica: string
  estado: EstadoExpediente
  fechaApertura: string
  ultimaActualizacion: string
  descripcion: string
  propuesta: { id: string; folio: string } | null
  historial: EventoExpediente[]
  actualizaciones: ActualizacionExpediente[]
}

let consecutivoEvento = 1
function evento(tipo: TipoEventoExpediente, descripcion: string, minutos: number, autor = 'Sistema LexApp'): EventoExpediente {
  return { id: `evt-${consecutivoEvento++}`, tipo, descripcion, fecha: haceMinutos(minutos), autor }
}

let consecutivoActualizacion = 1
function actualizacion(titulo: string, descripcion: string, minutos: number, visibleCliente = true): ActualizacionExpediente {
  return { id: `act-${consecutivoActualizacion++}`, titulo, descripcion, fecha: haceMinutos(minutos), autor: AUTOR_ABOGADO_MOCK, visibleCliente }
}

/** Mismos identificadores que las propuestas, movimientos, notificaciones y reuniones ficticias. */
export const expedientesMock: ExpedienteRegistroMock[] = [
  {
    id: 'exp-312', folio: 'Exp. 312/2026', clienteId: 'cli-110', asunto: 'Juicio de amparo contra multa municipal',
    areaJuridica: 'Derecho Administrativo', estado: 'activo', fechaApertura: haceMinutos(DIA * 40), ultimaActualizacion: haceMinutos(120),
    descripcion: 'Amparo indirecto contra la multa impuesta por la autoridad municipal a la obra de Constructora del Bajío, por falta de fundamentación y motivación.',
    propuesta: { id: 'pro-083', folio: 'PRO-2026-083' },
    historial: [
      evento('apertura', 'Expediente abierto a partir de la propuesta PRO-2026-083 aceptada por el cliente.', DIA * 40),
      evento('pago', 'El cliente pagó los honorarios de la presentación de la demanda.', DIA * 30),
      evento('documento', 'Se cargó "Acuerdo_admision_amparo.pdf".', 120, AUTOR_ABOGADO_MOCK),
    ],
    actualizaciones: [
      actualizacion('Demanda de amparo admitida', 'El juzgado admitió la demanda y fijó la audiencia constitucional. Se solicitó la suspensión provisional del cobro.', 120),
      actualizacion('Presentación de la demanda', 'Se presentó la demanda de amparo ante el Juzgado de Distrito en turno.', DIA * 25),
      actualizacion('Estrategia interna', 'Revisar si procede ampliar la demanda por el segundo requerimiento.', DIA * 20, false),
    ],
  },
  {
    id: 'exp-305', folio: 'Exp. 305/2026', clienteId: 'cli-108', asunto: 'Compraventa de local comercial y fideicomiso',
    areaJuridica: 'Derecho Inmobiliario', estado: 'activo', fechaApertura: haceMinutos(DIA * 28), ultimaActualizacion: haceMinutos(DIA),
    descripcion: 'Asesoría en la compraventa de un local comercial mediante fideicomiso de garantía: revisión de títulos, contrato y firma ante notario.',
    propuesta: { id: 'pro-087', folio: 'PRO-2026-087' },
    historial: [
      evento('apertura', 'Expediente abierto a partir de la propuesta PRO-2026-087 aceptada por el cliente.', DIA * 28),
      evento('pago', 'Se generó el cobro de la tercera parcialidad de honorarios.', DIA * 3),
      evento('pago', 'El pago de la segunda parcialidad está en procesamiento.', DIA),
    ],
    actualizaciones: [
      actualizacion('Proyecto de contrato enviado', 'Se envió al cliente el proyecto de contrato de fideicomiso para sus comentarios.', DIA),
      actualizacion('Revisión de títulos concluida', 'El inmueble no tiene gravámenes vigentes.', DIA * 12),
    ],
  },
  {
    id: 'exp-298', folio: 'Exp. 298/2026', clienteId: 'cli-103', asunto: 'Terminación laboral de nivel directivo',
    areaJuridica: 'Derecho Laboral', estado: 'activo', fechaApertura: haceMinutos(DIA * 30), ultimaActualizacion: haceMinutos(180),
    descripcion: 'Revisión de la liquidación ofrecida por el empleador y negociación de un convenio de terminación.',
    propuesta: null,
    historial: [
      evento('apertura', 'Expediente abierto por el abogado.', DIA * 30, AUTOR_ABOGADO_MOCK),
      evento('pago', 'El cliente pagó la consulta y análisis de liquidación.', DIA * 20),
      evento('documento', 'La cliente cargó "Recibos_de_nomina_2026.pdf".', 180, 'Elena Santillán Ruiz'),
    ],
    actualizaciones: [
      actualizacion('Cálculo de liquidación', 'La liquidación ofrecida está por debajo de lo que marca la ley. Se preparará una contrapropuesta.', DIA * 2),
    ],
  },
  {
    id: 'exp-290', folio: 'Exp. 290/2026', clienteId: 'cli-102', asunto: 'Juicio reivindicatorio de inmueble',
    areaJuridica: 'Derecho Civil', estado: 'activo', fechaApertura: haceMinutos(DIA * 90), ultimaActualizacion: haceMinutos(65),
    descripcion: 'Juicio para recuperar la posesión de un terreno ocupado sin derecho por un tercero.',
    propuesta: null,
    historial: [
      evento('apertura', 'Expediente abierto por el abogado.', DIA * 90, AUTOR_ABOGADO_MOCK),
      evento('pago', 'El cliente pagó el anticipo de honorarios.', 65),
    ],
    actualizaciones: [actualizacion('Emplazamiento realizado', 'Se emplazó a la parte demandada; corre el plazo para contestar.', DIA * 6)],
  },
  {
    id: 'exp-282', folio: 'Exp. 282/2026', clienteId: 'cli-105', asunto: 'Registro de marca y aviso comercial',
    areaJuridica: 'Propiedad Intelectual', estado: 'activo', fechaApertura: haceMinutos(DIA * 55), ultimaActualizacion: haceMinutos(DIA * 4),
    descripcion: 'Solicitud de registro de marca mixta y aviso comercial ante el IMPI para la nueva línea de productos.',
    propuesta: null,
    historial: [evento('apertura', 'Expediente abierto por el abogado.', DIA * 55, AUTOR_ABOGADO_MOCK)],
    actualizaciones: [actualizacion('Solicitud presentada', 'Se presentó la solicitud; el IMPI asignó número de expediente.', DIA * 4)],
  },
  {
    id: 'exp-320', folio: 'Exp. 320/2026', clienteId: 'cli-107', asunto: 'Aviso de privacidad y términos de servicio',
    areaJuridica: 'Protección de Datos', estado: 'en_espera', fechaApertura: haceMinutos(DIA * 5), ultimaActualizacion: haceMinutos(DIA * 2),
    descripcion: 'Elaboración del aviso de privacidad integral y de los términos de servicio de la plataforma.',
    propuesta: { id: 'pro-088', folio: 'PRO-2026-088' },
    historial: [
      evento('apertura', 'Expediente abierto a partir de la propuesta PRO-2026-088 aceptada por el cliente.', DIA * 5),
      evento('estado', 'Estado cambiado a "En espera": falta el inventario de datos personales del cliente.', DIA * 2, AUTOR_ABOGADO_MOCK),
    ],
    actualizaciones: [actualizacion('Información pendiente', 'Se pidió al cliente el inventario de datos personales que recaba la plataforma.', DIA * 2)],
  },
  {
    id: 'exp-301', folio: 'Exp. 301/2026', clienteId: 'cli-102', asunto: 'Regularización de escrituras de bodega',
    areaJuridica: 'Derecho Inmobiliario', estado: 'en_espera', fechaApertura: haceMinutos(DIA * 33), ultimaActualizacion: haceMinutos(DIA * 9),
    descripcion: 'Regularización de la escritura de una bodega con diferencias de superficie ante el Registro Público.',
    propuesta: null,
    historial: [
      evento('apertura', 'Expediente abierto por el abogado.', DIA * 33, AUTOR_ABOGADO_MOCK),
      evento('estado', 'Estado cambiado a "En espera": se espera la respuesta del Registro Público.', DIA * 9, AUTOR_ABOGADO_MOCK),
    ],
    actualizaciones: [],
  },
  {
    id: 'exp-275', folio: 'Exp. 275/2025', clienteId: 'cli-104', asunto: 'Demanda laboral de ex trabajador',
    areaJuridica: 'Derecho Laboral', estado: 'finalizado', fechaApertura: haceMinutos(DIA * 280), ultimaActualizacion: haceMinutos(DIA * 70),
    descripcion: 'Defensa de la empresa en una demanda por despido injustificado.',
    propuesta: null,
    historial: [
      evento('apertura', 'Expediente abierto por el abogado.', DIA * 280, AUTOR_ABOGADO_MOCK),
      evento('estado', 'Estado cambiado a "Finalizado": se firmó convenio ante el Centro de Conciliación.', DIA * 70, AUTOR_ABOGADO_MOCK),
    ],
    actualizaciones: [actualizacion('Convenio firmado', 'Las partes firmaron convenio; el asunto concluyó.', DIA * 70)],
  },
  {
    id: 'exp-268', folio: 'Exp. 268/2025', clienteId: 'cli-112', asunto: 'Recurso de revocación ante el SAT',
    areaJuridica: 'Derecho Fiscal', estado: 'finalizado', fechaApertura: haceMinutos(DIA * 230), ultimaActualizacion: haceMinutos(DIA * 40),
    descripcion: 'Recurso de revocación contra un crédito fiscal determinado por el SAT.',
    propuesta: null,
    historial: [
      evento('apertura', 'Expediente abierto por el abogado.', DIA * 230, AUTOR_ABOGADO_MOCK),
      evento('estado', 'Estado cambiado a "Finalizado": el SAT dejó sin efectos el crédito fiscal.', DIA * 40, AUTOR_ABOGADO_MOCK),
    ],
    actualizaciones: [],
  },
  {
    id: 'exp-260', folio: 'Exp. 260/2025', clienteId: 'cli-111', asunto: 'Rescisión de contrato de arrendamiento',
    areaJuridica: 'Derecho Civil', estado: 'finalizado', fechaApertura: haceMinutos(DIA * 380), ultimaActualizacion: haceMinutos(DIA * 200),
    descripcion: 'Rescisión del contrato de arrendamiento de vivienda por falta de pago.',
    propuesta: null,
    historial: [
      evento('apertura', 'Expediente abierto por el abogado.', DIA * 380, AUTOR_ABOGADO_MOCK),
      evento('estado', 'Estado cambiado a "Finalizado": sentencia favorable y entrega del inmueble.', DIA * 200, AUTOR_ABOGADO_MOCK),
    ],
    actualizaciones: [],
  },
]

/** Valida el cliente y el expediente de un cobro (D4). */
export function buscarExpedienteMock(id: string): ExpedienteRegistroMock {
  const expediente = expedientesMock.find((e) => e.id === id)
  if (!expediente) throw new ErrorApi('datos_invalidos')
  return expediente
}

/** Para pantallas de detalle: 403 si es de otro abogado, 404 si no existe. */
export function obtenerRegistroExpedienteMock(id: string): ExpedienteRegistroMock {
  if (id === EXPEDIENTE_AJENO_MOCK) throw new ErrorApi('sin_permiso')
  const expediente = expedientesMock.find((e) => e.id === id)
  if (!expediente) throw new ErrorApi('no_encontrado')
  return expediente
}

/** Los otros mocks (documentos, cobros) registran aquí sus eventos y actualizan la fecha. */
export function registrarEventoExpedienteMock(id: string, tipo: TipoEventoExpediente, descripcion: string, autor: string): void {
  const expediente = expedientesMock.find((e) => e.id === id)
  if (!expediente) return
  const ahora = new Date().toISOString()
  expediente.historial.push({ id: `evt-${consecutivoEvento++}`, tipo, descripcion, fecha: ahora, autor })
  expediente.ultimaActualizacion = ahora
}

/** D2 "Crear expediente" (propuesta aceptada). */
export function agregarExpedienteMock(datos: Pick<ExpedienteRegistroMock, 'id' | 'folio' | 'asunto' | 'clienteId' | 'areaJuridica' | 'descripcion' | 'propuesta'>): void {
  const ahora = new Date().toISOString()
  expedientesMock.push({
    ...datos,
    estado: 'activo',
    fechaApertura: ahora,
    ultimaActualizacion: ahora,
    historial: [
      {
        id: `evt-${consecutivoEvento++}`,
        tipo: 'apertura',
        descripcion: datos.propuesta
          ? `Expediente abierto a partir de la propuesta ${datos.propuesta.folio} aceptada por el cliente.`
          : 'Expediente abierto por el abogado.',
        fecha: ahora,
        autor: AUTOR_ABOGADO_MOCK,
      },
    ],
    actualizaciones: [],
  })
}

export function aResumenExpedienteMock(e: ExpedienteRegistroMock): ExpedienteResumen {
  const cliente = clientesMock.find((c) => c.id === e.clienteId)
  return {
    id: e.id,
    folio: e.folio,
    cliente: { id: e.clienteId, nombre: cliente?.nombre ?? '—', organizacion: cliente?.organizacion ?? null },
    asunto: e.asunto,
    areaJuridica: e.areaJuridica,
    estado: e.estado,
    fechaApertura: e.fechaApertura,
    ultimaActualizacion: e.ultimaActualizacion,
  }
}

export function expedientesDeClienteMock(clienteId: string): ExpedienteRegistroMock[] {
  return expedientesMock.filter((e) => e.clienteId === clienteId)
}

/** Indicador "Expedientes activos" del Dashboard. */
export function contarExpedientesActivosMock(): number {
  return expedientesMock.filter((e) => e.estado === 'activo').length
}

async function simularRed(milisegundos?: number): Promise<void> {
  await esperar(milisegundos)
  if (SIMULAR_ERROR_RED) throw new ErrorApi('red')
}

function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

/** D4: solo expedientes del cliente que no estén finalizados. */
export async function listarOpcionesExpedientesMock(clienteId: string): Promise<OpcionExpediente[]> {
  await simularRed(300)
  return expedientesMock
    .filter((e) => e.clienteId === clienteId && e.estado !== 'finalizado')
    .map(({ id, folio, asunto, clienteId: cliente }) => ({ id, folio, asunto, clienteId: cliente }))
}

export async function listarExpedientesMock(filtros: FiltrosExpedientes): Promise<RespuestaExpedientes> {
  await simularRed()
  const termino = normalizar(filtros.busqueda.trim())
  const base = expedientesMock.map(aResumenExpedienteMock).filter(
    (e) =>
      (!filtros.area || e.areaJuridica === filtros.area) &&
      (!termino ||
        [e.folio, e.asunto, e.cliente.nombre, e.cliente.organizacion ?? ''].some((campo) => normalizar(campo).includes(termino))),
  )
  const contar = (estado: FiltroExpedientes) => (estado === 'todos' ? base.length : base.filter((e) => e.estado === estado).length)
  const filtrados = base
    .filter((e) => filtros.estado === 'todos' || e.estado === filtros.estado)
    .sort((a, b) => b.ultimaActualizacion.localeCompare(a.ultimaActualizacion))
  const inicio = (filtros.pagina - 1) * filtros.porPagina
  return {
    expedientes: filtrados.slice(inicio, inicio + filtros.porPagina),
    total: filtrados.length,
    totalesPorEstado: { todos: contar('todos'), activo: contar('activo'), en_espera: contar('en_espera'), finalizado: contar('finalizado') },
  }
}

export async function registrarActualizacionMock(id: string, peticion: PeticionActualizacion): Promise<{ id: string }> {
  await simularRed(500)
  const expediente = obtenerRegistroExpedienteMock(id)
  if (expediente.estado === 'finalizado') throw new ErrorApi('conflicto')
  const nueva: ActualizacionExpediente = {
    id: `act-${consecutivoActualizacion++}`,
    titulo: peticion.titulo,
    descripcion: peticion.descripcion,
    fecha: new Date().toISOString(),
    autor: AUTOR_ABOGADO_MOCK,
    visibleCliente: peticion.visibleCliente,
  }
  expediente.actualizaciones.push(nueva)
  expediente.ultimaActualizacion = nueva.fecha
  return { id: nueva.id }
}

const ETIQUETAS_ESTADO: Record<EstadoExpediente, string> = { activo: 'Activo', en_espera: 'En espera', finalizado: 'Finalizado' }

export async function cambiarEstadoExpedienteMock(id: string, peticion: PeticionCambioEstado): Promise<void> {
  await simularRed(500)
  const expediente = obtenerRegistroExpedienteMock(id)
  if (expediente.estado === peticion.estado) throw new ErrorApi('conflicto')
  expediente.estado = peticion.estado
  registrarEventoExpedienteMock(id, 'estado', `Estado cambiado a "${ETIQUETAS_ESTADO[peticion.estado]}": ${peticion.nota}`, AUTOR_ABOGADO_MOCK)
}

