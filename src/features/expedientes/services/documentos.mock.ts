// MOCK: eliminar al conectar el backend
// Documentos en memoria. Los cargados en la sesión guardan el archivo real para la vista previa.
import { esperar, haceMinutos, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorApi } from '@/api/errores'
import { clientesMock } from '@/features/clientes/services/clientes.mock'
import type {
  DocumentoExpediente,
  FiltroDocumentos,
  FiltrosDocumentos,
  PeticionCargaDocumento,
  PeticionRevisionDocumento,
  RespuestaDocumentos,
  UrlDocumento,
} from '../types/documentos.types'
import {
  AUTOR_ABOGADO_MOCK,
  obtenerRegistroExpedienteMock,
  registrarEventoExpedienteMock,
} from './expedientes.mock'
import { crearPdfFicticio } from './pdf-ficticio.mock'

interface DocumentoMock extends DocumentoExpediente {
  expedienteId: string
}

const PDF = 'application/pdf'
const DIA = 60 * 24
let consecutivo = 1

function documento(
  expedienteId: string,
  nombre: string,
  categoria: DocumentoExpediente['categoria'],
  minutos: number,
  cargadoPor: DocumentoExpediente['cargadoPor'],
  estado: DocumentoExpediente['estado'],
  tamanoBytes: number,
  descripcion: string | null = null,
  nota: string | null = null,
): DocumentoMock {
  const historial: DocumentoExpediente['historial'] = [{ accion: 'cargado', fecha: haceMinutos(minutos), autor: cargadoPor.nombre, nota: null }]
  if (cargadoPor.rol === 'cliente' && estado === 'revisado') {
    historial.push({ accion: 'revisado', fecha: haceMinutos(Math.max(minutos - 60, 1)), autor: AUTOR_ABOGADO_MOCK, nota: null })
  }
  if (estado === 'requiere_correccion') {
    historial.push({ accion: 'correccion_solicitada', fecha: haceMinutos(Math.max(minutos - 60, 1)), autor: AUTOR_ABOGADO_MOCK, nota })
  }
  return {
    id: `doc-${String(consecutivo++).padStart(3, '0')}`,
    expedienteId, nombre, categoria, tipoArchivo: PDF, tamanoBytes,
    fechaCarga: haceMinutos(minutos), cargadoPor, estado, descripcion, historial,
  }
}

const abogado = { nombre: AUTOR_ABOGADO_MOCK, rol: 'abogado' } as const
const cliente = (nombre: string) => ({ nombre, rol: 'cliente' }) as const

const documentosMock: DocumentoMock[] = [
  documento('exp-312', 'Acuerdo_admision_amparo.pdf', 'acuerdos', 120, abogado, 'revisado', 1_420_000, 'Acuerdo del juzgado que admite la demanda.'),
  documento('exp-312', 'Demanda_de_amparo.pdf', 'escritos', DIA * 25, abogado, 'revisado', 2_310_000),
  documento('exp-312', 'Boleta_multa_municipal.pdf', 'pruebas', DIA * 38, cliente('Jorge Villaseñor Cano'), 'revisado', 640_000),
  documento('exp-312', 'Acta_constitutiva_Constructora.pdf', 'identificacion', DIA * 2, cliente('Jorge Villaseñor Cano'), 'pendiente_revision', 3_870_000),
  documento('exp-298', 'Recibos_de_nomina_2026.pdf', 'comprobantes', 180, cliente('Elena Santillán Ruiz'), 'pendiente_revision', 980_000),
  documento('exp-298', 'Convenio_de_terminacion.pdf', 'contratos', DIA * 2, cliente('Elena Santillán Ruiz'), 'pendiente_revision', 410_000, 'Propuesta de convenio que envió la empresa.'),
  documento('exp-298', 'Contrato_individual_de_trabajo.pdf', 'contratos', DIA * 25, cliente('Elena Santillán Ruiz'), 'requiere_correccion', 1_150_000, null, 'Falta la última hoja con las firmas.'),
  documento('exp-305', 'Proyecto_contrato_fideicomiso.pdf', 'contratos', DIA, abogado, 'revisado', 860_000),
  documento('exp-305', 'Certificado_libertad_gravamen.pdf', 'pruebas', DIA * 12, abogado, 'revisado', 520_000),
  documento('exp-305', 'Identificacion_representante.pdf', 'identificacion', DIA * 26, cliente('Roberto Garza Sada'), 'revisado', 1_200_000),
  documento('exp-290', 'Escritura_del_terreno.pdf', 'pruebas', DIA * 88, cliente('Carlos Mendoza Prieto'), 'revisado', 4_600_000),
  documento('exp-290', 'Escrito_de_demanda.pdf', 'escritos', DIA * 60, abogado, 'revisado', 1_870_000),
  documento('exp-282', 'Solicitud_registro_marca.pdf', 'escritos', DIA * 4, abogado, 'revisado', 730_000),
  documento('exp-282', 'Diseno_logotipo.pdf', 'otros', DIA * 50, cliente('Mariana Bosque Ortiz'), 'revisado', 2_050_000),
  documento('exp-320', 'Cuestionario_datos_personales.pdf', 'otros', DIA * 4, abogado, 'revisado', 310_000),
  documento('exp-275', 'Convenio_Centro_Conciliacion.pdf', 'contratos', DIA * 70, abogado, 'revisado', 1_340_000),
  documento('exp-268', 'Resolucion_SAT.pdf', 'acuerdos', DIA * 40, abogado, 'revisado', 990_000),
]

/** Archivos cargados en la sesión y PDF ficticios ya generados. */
const urlsGeneradas = new Map<string, string>()
const archivosCargados = new Map<string, File>()

async function simularRed(milisegundos?: number): Promise<void> {
  await esperar(milisegundos)
  if (SIMULAR_ERROR_RED) throw new ErrorApi('red')
}

function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

const porFechaDesc = (a: DocumentoMock, b: DocumentoMock) => b.fechaCarga.localeCompare(a.fechaCarga)

function sinExpediente(d: DocumentoMock): DocumentoExpediente {
  return {
    id: d.id, nombre: d.nombre, categoria: d.categoria, tipoArchivo: d.tipoArchivo, tamanoBytes: d.tamanoBytes,
    fechaCarga: d.fechaCarga, cargadoPor: { ...d.cargadoPor }, estado: d.estado, descripcion: d.descripcion,
    historial: d.historial.map((evento) => ({ ...evento })),
  }
}

/** Para E2 y F2. */
export function documentosDeExpedienteMock(expedienteId: string): DocumentoExpediente[] {
  return documentosMock.filter((d) => d.expedienteId === expedienteId).sort(porFechaDesc).map(sinExpediente)
}

export async function listarDocumentosMock(expedienteId: string, filtros: FiltrosDocumentos): Promise<RespuestaDocumentos> {
  await simularRed()
  const expediente = obtenerRegistroExpedienteMock(expedienteId)
  const titular = clientesMock.find((c) => c.id === expediente.clienteId)
  const termino = normalizar(filtros.busqueda.trim())
  const base = documentosMock.filter(
    (d) =>
      d.expedienteId === expedienteId &&
      (!filtros.categoria || d.categoria === filtros.categoria) &&
      (!termino || normalizar(d.nombre).includes(termino) || normalizar(d.descripcion ?? '').includes(termino)),
  )
  const contar = (estado: FiltroDocumentos) => (estado === 'todos' ? base.length : base.filter((d) => d.estado === estado).length)
  return {
    expediente: {
      id: expediente.id,
      folio: expediente.folio,
      asunto: expediente.asunto,
      estado: expediente.estado,
      cliente: { id: expediente.clienteId, nombre: titular?.nombre ?? '—' },
    },
    documentos: base.filter((d) => filtros.estado === 'todos' || d.estado === filtros.estado).sort(porFechaDesc).map(sinExpediente),
    totalesPorEstado: {
      todos: contar('todos'),
      pendiente_revision: contar('pendiente_revision'),
      revisado: contar('revisado'),
      requiere_correccion: contar('requiere_correccion'),
    },
  }
}

export async function cargarDocumentoMock(expedienteId: string, peticion: PeticionCargaDocumento): Promise<{ id: string }> {
  await simularRed(900)
  const expediente = obtenerRegistroExpedienteMock(expedienteId)
  if (expediente.estado === 'finalizado') throw new ErrorApi('conflicto')
  const ahora = new Date().toISOString()
  const id = `doc-${String(consecutivo++).padStart(3, '0')}`
  documentosMock.push({
    id,
    expedienteId,
    nombre: peticion.archivo.name,
    categoria: peticion.categoria,
    tipoArchivo: peticion.archivo.type || 'application/octet-stream',
    tamanoBytes: peticion.archivo.size,
    fechaCarga: ahora,
    cargadoPor: abogado,
    estado: 'revisado',
    descripcion: peticion.descripcion || null,
    historial: [{ accion: 'cargado', fecha: ahora, autor: AUTOR_ABOGADO_MOCK, nota: null }],
  })
  archivosCargados.set(id, peticion.archivo)
  registrarEventoExpedienteMock(expedienteId, 'documento', `Se cargó "${peticion.archivo.name}".`, AUTOR_ABOGADO_MOCK)
  return { id }
}

function buscarDocumento(expedienteId: string, documentoId: string): DocumentoMock {
  obtenerRegistroExpedienteMock(expedienteId)
  const documento = documentosMock.find((d) => d.id === documentoId && d.expedienteId === expedienteId)
  if (!documento) throw new ErrorApi('no_encontrado')
  return documento
}

export async function revisarDocumentoMock(expedienteId: string, documentoId: string, peticion: PeticionRevisionDocumento): Promise<void> {
  await simularRed(500)
  const documento = buscarDocumento(expedienteId, documentoId)
  if (documento.estado !== 'pendiente_revision') throw new ErrorApi('conflicto')
  documento.estado = peticion.estado
  documento.historial.push({
    accion: peticion.estado === 'revisado' ? 'revisado' : 'correccion_solicitada',
    fecha: new Date().toISOString(),
    autor: AUTOR_ABOGADO_MOCK,
    nota: peticion.nota,
  })
  registrarEventoExpedienteMock(
    expedienteId,
    'documento',
    peticion.estado === 'revisado' ? `Se revisó "${documento.nombre}".` : `Se pidió corregir "${documento.nombre}".`,
    AUTOR_ABOGADO_MOCK,
  )
}

/** Simula la URL temporal firmada: PDF ficticio o el archivo real cargado en la sesión. */
export async function obtenerUrlDocumentoMock(expedienteId: string, documentoId: string): Promise<UrlDocumento> {
  await simularRed(300)
  const documento = buscarDocumento(expedienteId, documentoId)
  let url = urlsGeneradas.get(documentoId)
  if (!url) {
    const archivo = archivosCargados.get(documentoId)
    url = URL.createObjectURL(
      archivo ??
        crearPdfFicticio([
          'LexApp - Documento ficticio de prueba',
          '',
          `Documento: ${documento.nombre}`,
          `Expediente: ${expedienteId}`,
          `Cargado por: ${documento.cargadoPor.nombre}`,
          '',
          'Este archivo solo existe para probar la vista previa y la descarga.',
        ]),
    )
    urlsGeneradas.set(documentoId, url)
  }
  return { url, expiraEn: new Date(Date.now() + 10 * 60_000).toISOString() }
}
