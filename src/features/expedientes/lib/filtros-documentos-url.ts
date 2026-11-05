import { esCategoriaDocumento } from '../schemas/documento.schema'
import type { FiltroDocumentos, FiltrosDocumentos } from '../types/documentos.types'

const ESTADOS: FiltroDocumentos[] = ['todos', 'pendiente_revision', 'revisado', 'requiere_correccion']

export function filtrosDocumentosDesdeUrl(parametros: URLSearchParams): FiltrosDocumentos {
  const categoria = parametros.get('categoria') ?? ''
  return {
    estado: ESTADOS.find((e) => e === parametros.get('estado')) ?? 'todos',
    categoria: esCategoriaDocumento(categoria) ? categoria : null,
    busqueda: (parametros.get('q') ?? '').slice(0, 100),
  }
}

export function filtrosDocumentosAUrl(filtros: FiltrosDocumentos): Record<string, string> {
  const parametros: Record<string, string> = {}
  if (filtros.estado !== 'todos') parametros.estado = filtros.estado
  if (filtros.categoria) parametros.categoria = filtros.categoria
  if (filtros.busqueda) parametros.q = filtros.busqueda
  return parametros
}
