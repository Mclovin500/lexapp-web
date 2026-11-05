import type { EstadoExpediente } from './expedientes.types'

/** PROPUESTA: estados de un documento del expediente (E3). */
export type EstadoDocumento = 'pendiente_revision' | 'revisado' | 'requiere_correccion'
export type FiltroDocumentos = 'todos' | EstadoDocumento

export type CategoriaDocumento =
  | 'escritos'
  | 'acuerdos'
  | 'contratos'
  | 'pruebas'
  | 'identificacion'
  | 'comprobantes'
  | 'otros'

export type AccionDocumento = 'cargado' | 'revisado' | 'correccion_solicitada'

/** "Historial cuando corresponda". */
export interface EventoDocumento {
  accion: AccionDocumento
  fecha: string
  autor: string
  nota: string | null
}

export interface DocumentoExpediente {
  id: string
  nombre: string
  categoria: CategoriaDocumento
  /** Tipo MIME. */
  tipoArchivo: string
  tamanoBytes: number
  fechaCarga: string
  cargadoPor: { nombre: string; rol: 'abogado' | 'cliente' }
  estado: EstadoDocumento
  descripcion: string | null
  historial: EventoDocumento[]
}

export interface FiltrosDocumentos {
  estado: FiltroDocumentos
  categoria: CategoriaDocumento | null
  /** Nombre del documento. */
  busqueda: string
}

/** `GET /expedientes/{id}/documentos?estado=&categoria=&busqueda=` (E3). */
export interface RespuestaDocumentos {
  expediente: {
    id: string
    folio: string
    asunto: string
    estado: EstadoExpediente
    cliente: { id: string; nombre: string }
  }
  documentos: DocumentoExpediente[]
  totalesPorEstado: Record<FiltroDocumentos, number>
}

/** `POST /expedientes/{id}/documentos` (multipart/form-data). */
export interface PeticionCargaDocumento {
  archivo: File
  categoria: CategoriaDocumento
  descripcion: string
}

/** `PATCH /expedientes/{id}/documentos/{documentoId}`. */
export interface PeticionRevisionDocumento {
  estado: 'revisado' | 'requiere_correccion'
  nota: string | null
}

/** `GET /expedientes/{id}/documentos/{documentoId}/url`: URL temporal firmada. */
export interface UrlDocumento {
  url: string
  expiraEn: string
}
