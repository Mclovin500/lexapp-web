// E3: documentos del expediente sobre `GET|POST /api/casos/{id}/documentos` (CasosController).
// El backend aún no guarda tamaño, revisión ni historial, ni entrega URL de descarga.
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import { categoriasDocumento } from '../content/documentos.content'
import type {
  CategoriaDocumento,
  DocumentoExpediente,
  FiltroDocumentos,
  FiltrosDocumentos,
  PeticionCargaDocumento,
  PeticionRevisionDocumento,
  RespuestaDocumentos,
  UrlDocumento,
} from '../types/documentos.types'
import {
  estadoExpediente,
  folioExpediente,
  listarDocumentosApi,
  noDisponible,
  normalizarTexto,
  obtenerCasoApi,
  type DocumentoCasoApi,
} from './casos.api'

const MIME_POR_EXTENSION: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
}

function aCategoria(tipo: string | null): CategoriaDocumento {
  return tipo && tipo in categoriasDocumento ? (tipo as CategoriaDocumento) : 'otros'
}

/** Solo el abogado asignado puede subir documentos al caso (`[Authorize(Roles = "abogado")]`). */
export function aDocumentoExpediente(d: DocumentoCasoApi, nombreAbogado: string): DocumentoExpediente {
  const extension = d.nombreArchivo.split('.').pop()?.toLowerCase() ?? ''
  return {
    id: String(d.idDocumento),
    nombre: d.nombreArchivo,
    categoria: aCategoria(d.tipoDocumento),
    tipoArchivo: MIME_POR_EXTENSION[extension] ?? 'application/octet-stream',
    tamanoBytes: 0,
    fechaCarga: d.fechaSubida,
    cargadoPor: { nombre: nombreAbogado, rol: 'abogado' },
    // Los documentos los carga el propio abogado: no hay revisión pendiente.
    estado: 'revisado',
    descripcion: null,
    historial: [{ accion: 'cargado', fecha: d.fechaSubida, autor: nombreAbogado, nota: null }],
  }
}

export async function listarDocumentos(expedienteId: string, filtros: FiltrosDocumentos): Promise<RespuestaDocumentos> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarDocumentosMock } = await import('./documentos.mock')
    return listarDocumentosMock(expedienteId, filtros)
  }

  const [caso, documentosApi] = await Promise.all([obtenerCasoApi(expedienteId), listarDocumentosApi(expedienteId)])
  const busqueda = normalizarTexto(filtros.busqueda.trim())
  const base = documentosApi
    .map((d) => aDocumentoExpediente(d, caso.nombreAbogado))
    .filter((d) => (!filtros.categoria || d.categoria === filtros.categoria) && (!busqueda || normalizarTexto(d.nombre).includes(busqueda)))
    .sort((a, b) => b.fechaCarga.localeCompare(a.fechaCarga))

  const contar = (estado: FiltroDocumentos) => (estado === 'todos' ? base.length : base.filter((d) => d.estado === estado).length)
  return {
    expediente: {
      id: String(caso.idCaso),
      folio: folioExpediente(caso.idCaso),
      asunto: caso.titulo,
      estado: estadoExpediente(caso.estadoCaso),
      cliente: { id: String(caso.idCliente), nombre: caso.nombreCliente },
    },
    documentos: base.filter((d) => filtros.estado === 'todos' || d.estado === filtros.estado),
    totalesPorEstado: {
      todos: contar('todos'),
      pendiente_revision: contar('pendiente_revision'),
      revisado: contar('revisado'),
      requiere_correccion: contar('requiere_correccion'),
    },
  }
}

/** Multipart: `archivo` + `tipoDocumento` (guardamos la categoría). La descripción aún no tiene columna. */
export async function cargarDocumento(expedienteId: string, peticion: PeticionCargaDocumento): Promise<{ id: string }> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { cargarDocumentoMock } = await import('./documentos.mock')
    return cargarDocumentoMock(expedienteId, peticion)
  }

  const datos = new FormData()
  datos.append('archivo', peticion.archivo)
  datos.append('tipoDocumento', peticion.categoria)

  try {
    const respuesta = await api.post<DocumentoCasoApi>(ENDPOINTS.casos.documentos(expedienteId), datos)
    return { id: String(respuesta.data.idDocumento) }
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function revisarDocumento(expedienteId: string, documentoId: string, peticion: PeticionRevisionDocumento): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { revisarDocumentoMock } = await import('./documentos.mock')
    return revisarDocumentoMock(expedienteId, documentoId, peticion)
  }
  noDisponible()
}

/** El backend aún no firma URLs de `documentos-abogados`. */
export async function obtenerUrlDocumento(expedienteId: string, documentoId: string): Promise<UrlDocumento> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerUrlDocumentoMock } = await import('./documentos.mock')
    return obtenerUrlDocumentoMock(expedienteId, documentoId)
  }
  noDisponible()
}
