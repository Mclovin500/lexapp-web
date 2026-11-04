import { propuestasContent } from '../content/propuestas.content'
import type { FiltroPropuestas, FiltrosPropuestas } from '../types/propuestas.types'

const ESTADOS: FiltroPropuestas[] = ['todas', 'borrador', 'enviada', 'pendiente_respuesta', 'aceptada', 'rechazada', 'cancelada']

export function filtrosDesdeUrl(parametros: URLSearchParams): FiltrosPropuestas {
  const pagina = Number.parseInt(parametros.get('pagina') ?? '1', 10)
  return {
    estado: ESTADOS.find((e) => e === parametros.get('estado')) ?? 'todas',
    busqueda: (parametros.get('q') ?? '').slice(0, 100),
    pagina: Number.isFinite(pagina) && pagina > 0 ? pagina : 1,
    porPagina: propuestasContent.porPagina,
  }
}

export function filtrosAUrl(filtros: FiltrosPropuestas): Record<string, string> {
  const parametros: Record<string, string> = {}
  if (filtros.estado !== 'todas') parametros.estado = filtros.estado
  if (filtros.busqueda) parametros.q = filtros.busqueda
  if (filtros.pagina > 1) parametros.pagina = String(filtros.pagina)
  return parametros
}
