import { expedientesContent } from '../content/expedientes.content'
import type { FiltroExpedientes, FiltrosExpedientes } from '../types/expedientes.types'

const ESTADOS: FiltroExpedientes[] = ['todos', 'activo', 'en_espera', 'finalizado']

export function filtrosDesdeUrl(parametros: URLSearchParams): FiltrosExpedientes {
  const pagina = Number.parseInt(parametros.get('pagina') ?? '1', 10)
  const area = (parametros.get('area') ?? '').slice(0, 80)
  return {
    estado: ESTADOS.find((e) => e === parametros.get('estado')) ?? 'todos',
    area: area || null,
    busqueda: (parametros.get('q') ?? '').slice(0, 100),
    pagina: Number.isFinite(pagina) && pagina > 0 ? pagina : 1,
    porPagina: expedientesContent.porPagina,
  }
}

export function filtrosAUrl(filtros: FiltrosExpedientes): Record<string, string> {
  const parametros: Record<string, string> = {}
  if (filtros.estado !== 'todos') parametros.estado = filtros.estado
  if (filtros.area) parametros.area = filtros.area
  if (filtros.busqueda) parametros.q = filtros.busqueda
  if (filtros.pagina > 1) parametros.pagina = String(filtros.pagina)
  return parametros
}
