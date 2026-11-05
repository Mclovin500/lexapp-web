// MOCK: eliminar al conectar el backend
// Datos ficticios en memoria (se reinician al recargar). Nunca en storage.
import { enMinutos, esperar, haceMinutos, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorApi } from '@/api/errores'
import type {
  FiltroEstadoSolicitud,
  FiltrosSolicitudes,
  OpcionSolicitud,
  PeticionRechazoSolicitud,
  RespuestaListadoSolicitudes,
  SolicitudDetalle,
  SolicitudResumen,
} from '../types/solicitudes.types'

function doc(id: string, nombre: string, tipoArchivo: string, kb: number, minutos: number) {
  return { id, nombre, tipoArchivo, tamanoBytes: kb * 1024, fechaCarga: haceMinutos(minutos), url: null }
}

const solicitudesMock: SolicitudDetalle[] = [
  {
    id: 'sol-0842',
    folio: 'SOL-2026-0842',
    cliente: { id: 'cli-101', nombre: 'Valeria Gómez Rivas', tipoPersona: 'moral', organizacion: 'Fintech Nova S.A.P.I. de C.V.', correo: 'valeria.gomez@novapay.mx', telefono: '55 4192 8830' },
    areaJuridica: 'Derecho Corporativo y Mercantil',
    asunto: 'Revisión de pacto de socios y acuerdo de inversión de ronda semilla',
    fechaRecepcion: haceMinutos(24),
    estado: 'nueva',
    prioridad: 'alta',
    descripcion:
      'Estamos cerrando una ronda de inversión semilla con un fondo extranjero y dos inversionistas locales. Necesitamos revisar el term sheet, el acuerdo de inversión y el pacto de socios bajo legislación mexicana, en particular las cláusulas de arrastre, acompañamiento y derechos de preferencia.',
    informacionAdicional: [
      { etiqueta: 'Fecha límite deseada', valor: 'Antes del 20 de noviembre de 2026' },
      { etiqueta: 'Canal de contacto preferido', valor: 'Videollamada y chat' },
      { etiqueta: 'Contrapartes', valor: 'Fondo de capital de riesgo (EE. UU.) y dos inversionistas ángel' },
    ],
    documentos: [
      doc('doc-1', 'Term_sheet_v3.pdf', 'PDF', 1430, 26),
      doc('doc-2', 'Estatutos_sociales_vigentes.pdf', 'PDF', 3890, 25),
      doc('doc-3', 'Estructura_accionaria_2026.xlsx', 'XLSX', 420, 25),
    ],
    motivoRechazo: null,
  },
  {
    id: 'sol-0841',
    folio: 'SOL-2026-0841',
    cliente: { id: 'cli-102', nombre: 'Carlos Mendoza Prieto', tipoPersona: 'moral', organizacion: 'Grupo Inmobiliario Nexus', correo: 'cmendoza@nexus.mx', telefono: '81 2233 4455' },
    areaJuridica: 'Derecho Corporativo y Mercantil',
    asunto: 'Constitución de sociedad anónima y redacción de pacto de socios',
    fechaRecepcion: haceMinutos(70),
    estado: 'nueva',
    prioridad: 'media',
    descripcion:
      'Queremos constituir una sociedad anónima con tres socios fundadores para un proyecto inmobiliario. Requerimos la redacción de estatutos y de un pacto de socios con reglas de salida y toma de decisiones.',
    informacionAdicional: [
      { etiqueta: 'Número de socios', valor: '3' },
      { etiqueta: 'Entidad', valor: 'Nuevo León' },
    ],
    documentos: [],
    motivoRechazo: null,
  },
  {
    id: 'sol-0840',
    folio: 'SOL-2026-0840',
    cliente: { id: 'cli-103', nombre: 'Elena Santillán Ruiz', tipoPersona: 'fisica', organizacion: null, correo: 'elena.santillan@correo.mx', telefono: null },
    areaJuridica: 'Derecho Laboral',
    asunto: 'Asesoría por terminación de contrato de nivel directivo',
    fechaRecepcion: haceMinutos(185),
    estado: 'nueva',
    prioridad: null,
    descripcion:
      'Mi empleador me notificó la terminación de mi contrato como directora de operaciones. Quiero saber si la liquidación ofrecida es correcta y qué opciones tengo para negociar.',
    informacionAdicional: [{ etiqueta: 'Antigüedad', valor: '7 años' }],
    documentos: [doc('doc-4', 'Carta_de_terminacion.pdf', 'PDF', 210, 190)],
    motivoRechazo: null,
  },
  {
    id: 'sol-0839',
    folio: 'SOL-2026-0839',
    cliente: { id: 'cli-104', nombre: 'Fernando Garay Luna', tipoPersona: 'moral', organizacion: 'Soluciones Logísticas S.A. de C.V.', correo: 'fgaray@sollog.mx', telefono: '33 1020 3040' },
    areaJuridica: 'Derecho Laboral',
    asunto: 'Auditoría laboral preventiva y actualización de contratos',
    fechaRecepcion: haceMinutos(60 * 18),
    estado: 'en_revision',
    prioridad: 'media',
    descripcion:
      'Buscamos una auditoría preventiva de nuestros contratos laborales y reglamento interior de trabajo para 120 colaboradores.',
    informacionAdicional: [{ etiqueta: 'Colaboradores', valor: '120' }],
    documentos: [doc('doc-5', 'Reglamento_interior.docx', 'DOCX', 96, 60 * 18)],
    motivoRechazo: null,
  },
  {
    id: 'sol-0838',
    folio: 'SOL-2026-0838',
    cliente: { id: 'cli-105', nombre: 'Mariana Bosque Ortiz', tipoPersona: 'moral', organizacion: 'BioPharma Lab S.A.', correo: 'mbosque@biopharma.mx', telefono: '55 7788 9900' },
    areaJuridica: 'Propiedad Intelectual',
    asunto: 'Registro de marca y estrategia de protección de patentes',
    fechaRecepcion: haceMinutos(60 * 26),
    estado: 'en_revision',
    prioridad: 'alta',
    descripcion:
      'Lanzaremos una nueva línea de productos y necesitamos registrar la marca y evaluar la protección de una fórmula mediante patente.',
    informacionAdicional: [{ etiqueta: 'Clases de marca', valor: '3 y 5' }],
    documentos: [],
    motivoRechazo: null,
  },
  {
    id: 'sol-0837',
    folio: 'SOL-2026-0837',
    cliente: { id: 'cli-106', nombre: 'Andrés Peñaloza Ramírez', tipoPersona: 'fisica', organizacion: null, correo: 'apenaloza@correo.mx', telefono: '222 345 6789' },
    areaJuridica: 'Derecho Civil',
    asunto: 'Sucesión testamentaria y adjudicación de inmueble',
    fechaRecepcion: haceMinutos(60 * 50),
    estado: 'en_revision',
    prioridad: 'baja',
    descripcion:
      'Mi padre falleció y dejó testamento. Necesitamos iniciar la sucesión y adjudicar una casa a los herederos.',
    informacionAdicional: [{ etiqueta: 'Herederos', valor: '3' }],
    documentos: [doc('doc-6', 'Testamento.pdf', 'PDF', 880, 60 * 50)],
    motivoRechazo: null,
  },
  {
    id: 'sol-0836',
    folio: 'SOL-2026-0836',
    cliente: { id: 'cli-107', nombre: 'Claudia Treviño Garza', tipoPersona: 'moral', organizacion: 'TechHub México S.A.S.', correo: 'claudia@techhub.mx', telefono: null },
    areaJuridica: 'Protección de Datos',
    asunto: 'Aviso de privacidad y términos de servicio de plataforma digital',
    fechaRecepcion: haceMinutos(60 * 72),
    estado: 'atendida',
    prioridad: null,
    descripcion: 'Necesitamos redactar el aviso de privacidad y los términos de servicio de nuestra plataforma conforme a la LFPDPPP.',
    informacionAdicional: [],
    documentos: [],
    motivoRechazo: null,
  },
  {
    id: 'sol-0835',
    folio: 'SOL-2026-0835',
    cliente: { id: 'cli-108', nombre: 'Roberto Garza Sada', tipoPersona: 'moral', organizacion: 'Inversiones del Norte', correo: 'rgarza@invnorte.mx', telefono: '81 5566 7788' },
    areaJuridica: 'Derecho Inmobiliario',
    asunto: 'Compraventa de inmueble comercial y constitución de fideicomiso',
    fechaRecepcion: haceMinutos(60 * 96),
    estado: 'atendida',
    prioridad: 'media',
    descripcion: 'Adquiriremos un local comercial y queremos estructurar la compra mediante un fideicomiso.',
    informacionAdicional: [],
    documentos: [],
    motivoRechazo: null,
  },
  {
    id: 'sol-0834',
    folio: 'SOL-2026-0834',
    cliente: { id: 'cli-109', nombre: 'Patricia Ortiz Medina', tipoPersona: 'fisica', organizacion: null, correo: 'paty.ortiz@correo.mx', telefono: null },
    areaJuridica: 'Derecho Familiar',
    asunto: 'Divorcio voluntario y convenio de custodia',
    fechaRecepcion: haceMinutos(60 * 120),
    estado: 'rechazada',
    prioridad: null,
    descripcion: 'Mi esposo y yo queremos divorciarnos de mutuo acuerdo y definir la custodia de nuestros hijos.',
    informacionAdicional: [],
    documentos: [],
    motivoRechazo: 'El asunto está fuera de mis áreas de práctica. Recomiendo buscar un especialista en derecho familiar.',
  },
  {
    id: 'sol-0833',
    folio: 'SOL-2026-0833',
    cliente: { id: 'cli-110', nombre: 'Jorge Villaseñor Cano', tipoPersona: 'moral', organizacion: 'Constructora del Bajío', correo: 'jvillasenor@cbajio.mx', telefono: '477 123 4567' },
    areaJuridica: 'Derecho Administrativo',
    asunto: 'Recurso contra multa municipal por licencia de construcción',
    fechaRecepcion: haceMinutos(60 * 150),
    estado: 'atendida',
    prioridad: 'alta',
    descripcion: 'Recibimos una multa municipal por supuestas irregularidades en la licencia de construcción y queremos impugnarla.',
    informacionAdicional: [{ etiqueta: 'Plazo para impugnar', valor: `Vence ${new Date(enMinutos(60 * 24 * 9)).toLocaleDateString('es-MX')}` }],
    documentos: [doc('doc-7', 'Resolucion_multa.pdf', 'PDF', 640, 60 * 150)],
    motivoRechazo: null,
  },
  {
    id: 'sol-0832',
    folio: 'SOL-2026-0832',
    cliente: { id: 'cli-111', nombre: 'Lucía Hernández Prado', tipoPersona: 'fisica', organizacion: null, correo: 'lucia.hp@correo.mx', telefono: '55 1111 2222' },
    areaJuridica: 'Derecho Civil',
    asunto: 'Incumplimiento de contrato de arrendamiento',
    fechaRecepcion: haceMinutos(60 * 170),
    estado: 'en_revision',
    prioridad: null,
    descripcion: 'El inquilino de mi departamento dejó de pagar la renta hace cuatro meses y no quiere desocupar.',
    informacionAdicional: [{ etiqueta: 'Meses de adeudo', valor: '4' }],
    documentos: [doc('doc-8', 'Contrato_arrendamiento.pdf', 'PDF', 512, 60 * 170)],
    motivoRechazo: null,
  },
  {
    id: 'sol-0831',
    folio: 'SOL-2026-0831',
    cliente: { id: 'cli-112', nombre: 'Héctor Salinas Ibarra', tipoPersona: 'moral', organizacion: 'Agroexportadora del Pacífico', correo: 'hsalinas@agropac.mx', telefono: '667 222 3344' },
    areaJuridica: 'Derecho Fiscal',
    asunto: 'Defensa ante requerimiento del SAT por devolución de IVA',
    fechaRecepcion: haceMinutos(60 * 200),
    estado: 'atendida',
    prioridad: 'media',
    descripcion: 'El SAT nos requirió información adicional sobre una solicitud de devolución de IVA y queremos responder correctamente.',
    informacionAdicional: [],
    documentos: [],
    motivoRechazo: null,
  },
]

async function simularRed(): Promise<void> {
  await esperar()
  if (SIMULAR_ERROR_RED) throw new ErrorApi('red')
}

function aResumen(s: SolicitudDetalle): SolicitudResumen {
  return {
    id: s.id,
    folio: s.folio,
    cliente: { id: s.cliente.id, nombre: s.cliente.nombre, tipoPersona: s.cliente.tipoPersona, organizacion: s.cliente.organizacion },
    areaJuridica: s.areaJuridica,
    asunto: s.asunto,
    fechaRecepcion: s.fechaRecepcion,
    estado: s.estado,
    prioridad: s.prioridad,
  }
}

function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

const porFechaDesc = (a: SolicitudDetalle, b: SolicitudDetalle) => b.fechaRecepcion.localeCompare(a.fechaRecepcion)

/** Para el contador del Sidebar y del Dashboard. */
export function contarSolicitudesNuevasMock(): number {
  return solicitudesMock.filter((s) => s.estado === 'nueva').length
}

/** Para el chat (H1): datos de quien envió una solicitud aunque aún no sea cliente. */
export function contactoDeSolicitudMock(clienteId: string): { id: string; nombre: string; organizacion: string | null } | null {
  const solicitud = solicitudesMock.find((s) => s.cliente.id === clienteId)
  return solicitud ? { id: solicitud.cliente.id, nombre: solicitud.cliente.nombre, organizacion: solicitud.cliente.organizacion } : null
}

/** Para crear un expediente desde una propuesta (D2). */
export function areaDeSolicitudMock(id: string): string | null {
  return solicitudesMock.find((s) => s.id === id)?.areaJuridica ?? null
}

/** Para el historial de interacción de F2. */
export function solicitudesDeClienteMock(clienteId: string): Pick<SolicitudDetalle, 'id' | 'folio' | 'asunto' | 'fechaRecepcion' | 'estado'>[] {
  return solicitudesMock
    .filter((s) => s.cliente.id === clienteId)
    .map(({ id, folio, asunto, fechaRecepcion, estado }) => ({ id, folio, asunto, fechaRecepcion, estado }))
}

/** Para "Nuevas solicitudes" del Dashboard. */
export function solicitudesNuevasRecientesMock(limite: number): SolicitudResumen[] {
  return solicitudesMock.filter((s) => s.estado === 'nueva').sort(porFechaDesc).slice(0, limite).map(aResumen)
}

export async function listarSolicitudesMock(filtros: FiltrosSolicitudes): Promise<RespuestaListadoSolicitudes> {
  await simularRed()
  const busqueda = normalizar(filtros.busqueda.trim())

  // Totales por estado respetando área y búsqueda (como haría el backend).
  const base = solicitudesMock.filter(
    (s) =>
      (!filtros.area || s.areaJuridica === filtros.area) &&
      (!busqueda || normalizar(`${s.cliente.nombre} ${s.cliente.organizacion ?? ''} ${s.areaJuridica}`).includes(busqueda)),
  )
  const contar = (estado: FiltroEstadoSolicitud) =>
    estado === 'todas' ? base.length : base.filter((s) => s.estado === estado).length

  const filtradas = base
    .filter((s) => filtros.estado === 'todas' || s.estado === filtros.estado)
    .sort(porFechaDesc)
  const inicio = (filtros.pagina - 1) * filtros.porPagina

  return {
    solicitudes: filtradas.slice(inicio, inicio + filtros.porPagina).map(aResumen),
    total: filtradas.length,
    totalesPorEstado: {
      todas: contar('todas'),
      nueva: contar('nueva'),
      en_revision: contar('en_revision'),
      atendida: contar('atendida'),
    },
  }
}

function buscar(id: string): SolicitudDetalle {
  const solicitud = solicitudesMock.find((s) => s.id === id)
  if (!solicitud) throw new ErrorApi('no_encontrado')
  return solicitud
}

export async function obtenerSolicitudMock(id: string): Promise<SolicitudDetalle> {
  await simularRed()
  const solicitud = buscar(id)
  return { ...solicitud, documentos: [...solicitud.documentos], informacionAdicional: [...solicitud.informacionAdicional] }
}

/** D1: solicitudes abiertas (nueva o en revisión) del cliente. */
export async function listarOpcionesSolicitudesMock(clienteId: string): Promise<OpcionSolicitud[]> {
  await esperar(300)
  if (SIMULAR_ERROR_RED) throw new ErrorApi('red')
  return solicitudesMock
    .filter((s) => s.cliente.id === clienteId && (s.estado === 'nueva' || s.estado === 'en_revision'))
    .map((s) => ({ id: s.id, folio: s.folio, asunto: s.asunto }))
}

/** D1: valida que la solicitud sea del cliente y siga abierta. */
export function validarSolicitudDeClienteMock(solicitudId: string, clienteId: string): OpcionSolicitud {
  const s = solicitudesMock.find((item) => item.id === solicitudId)
  if (!s || s.cliente.id !== clienteId) throw new ErrorApi('datos_invalidos')
  return { id: s.id, folio: s.folio, asunto: s.asunto }
}

/** D1 "Enviar propuesta": la solicitud relacionada queda atendida. */
export function marcarSolicitudAtendidaMock(solicitudId: string): void {
  const s = solicitudesMock.find((item) => item.id === solicitudId)
  if (s && (s.estado === 'nueva' || s.estado === 'en_revision')) s.estado = 'atendida'
}

/** "Revisar información": nueva → en revisión. */
export async function revisarSolicitudMock(id: string): Promise<void> {
  await simularRed()
  const solicitud = buscar(id)
  if (solicitud.estado === 'nueva') solicitud.estado = 'en_revision'
}

export async function rechazarSolicitudMock(id: string, peticion: PeticionRechazoSolicitud): Promise<void> {
  await simularRed()
  const solicitud = buscar(id)
  if (solicitud.estado !== 'nueva' && solicitud.estado !== 'en_revision') throw new ErrorApi('conflicto')
  solicitud.estado = 'rechazada'
  solicitud.motivoRechazo = peticion.motivo
}
