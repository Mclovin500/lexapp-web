import type { FiltroEstadoSolicitud, FiltrosSolicitudes } from '../types/solicitudes.types'
import { areasJuridicas, solicitudesContent } from '../content/solicitudes.content'

const ESTADOS: FiltroEstadoSolicitud[] = ['todas', 'nueva', 'en_revision', 'atendida']

/** Lee los filtros de C1 desde la URL (?estado=&area=&q=&pagina=), validando cada valor. */
export function filtrosDesdeUrl(parametros: URLSearchParams): FiltrosSolicitudes {
  const estado = ESTADOS.find((e) => e === parametros.get('estado')) ?? 'todas'
  const area = areasJuridicas.find((a) => a === parametros.get('area')) ?? null
  const pagina = Number.parseInt(parametros.get('pagina') ?? '1', 10)
  return {
    estado,
    area,
    busqueda: (parametros.get('q') ?? '').slice(0, 100),
    pagina: Number.isFinite(pagina) && pagina > 0 ? pagina : 1,
    porPagina: solicitudesContent.porPagina,
  }
}

/** Escribe solo los filtros distintos del valor por defecto. */
export function filtrosAUrl(filtros: FiltrosSolicitudes): Record<string, string> {
  const parametros: Record<string, string> = {}
  if (filtros.estado !== 'todas') parametros.estado = filtros.estado
  if (filtros.area) parametros.area = filtros.area
  if (filtros.busqueda) parametros.q = filtros.busqueda
  if (filtros.pagina > 1) parametros.pagina = String(filtros.pagina)
  return parametros
}
