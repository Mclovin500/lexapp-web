import { honorariosContent } from '../content/honorarios.content'
import type { FiltroMovimientos, FiltrosMovimientos } from '../types/pagos.types'

const ESTADOS: FiltroMovimientos[] = ['todos', 'pendiente', 'pagado', 'en_proceso', 'rechazado', 'retenido', 'liberado']

export function filtrosDesdeUrl(parametros: URLSearchParams): FiltrosMovimientos {
  const pagina = Number.parseInt(parametros.get('pagina') ?? '1', 10)
  const propuesta = parametros.get('propuesta')
  return {
    estado: ESTADOS.find((e) => e === parametros.get('estado')) ?? 'todos',
    busqueda: (parametros.get('q') ?? '').slice(0, 100),
    propuestaId: propuesta && /^[\w-]{1,40}$/.test(propuesta) ? propuesta : null,
    pagina: Number.isFinite(pagina) && pagina > 0 ? pagina : 1,
    porPagina: honorariosContent.porPagina,
  }
}

export function filtrosAUrl(filtros: FiltrosMovimientos): Record<string, string> {
  const parametros: Record<string, string> = {}
  if (filtros.estado !== 'todos') parametros.estado = filtros.estado
  if (filtros.busqueda) parametros.q = filtros.busqueda
  if (filtros.propuestaId) parametros.propuesta = filtros.propuestaId
  if (filtros.pagina > 1) parametros.pagina = String(filtros.pagina)
  return parametros
}
