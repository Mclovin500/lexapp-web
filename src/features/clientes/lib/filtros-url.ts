import { clientesContent } from '../content/clientes.content'
import type { FiltroClientes, FiltrosClientes } from '../types/clientes.types'

const ESTADOS: FiltroClientes[] = ['todos', 'activo', 'en_propuesta', 'inactivo']

export function filtrosDesdeUrl(parametros: URLSearchParams): FiltrosClientes {
  const pagina = Number.parseInt(parametros.get('pagina') ?? '1', 10)
  return {
    estado: ESTADOS.find((e) => e === parametros.get('estado')) ?? 'todos',
    busqueda: (parametros.get('q') ?? '').slice(0, 100),
    pagina: Number.isFinite(pagina) && pagina > 0 ? pagina : 1,
    porPagina: clientesContent.porPagina,
  }
}

export function filtrosAUrl(filtros: FiltrosClientes): Record<string, string> {
  const parametros: Record<string, string> = {}
  if (filtros.estado !== 'todos') parametros.estado = filtros.estado
  if (filtros.busqueda) parametros.q = filtros.busqueda
  if (filtros.pagina > 1) parametros.pagina = String(filtros.pagina)
  return parametros
}
