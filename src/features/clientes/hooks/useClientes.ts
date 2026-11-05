import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { ErrorApi } from '@/api/errores'
import { listarClientes, obtenerCliente } from '../services/clientes.service'
import type { ClienteDetalle, FiltrosClientes, RespuestaClientes } from '../types/clientes.types'

export function useListadoClientes(filtros: FiltrosClientes) {
  return useQuery<RespuestaClientes, ErrorApi>({
    queryKey: ['clientes', 'listado', filtros],
    queryFn: () => listarClientes(filtros),
    placeholderData: keepPreviousData,
    staleTime: 0,
    retry: false,
  })
}

export function useDetalleCliente(id: string) {
  return useQuery<ClienteDetalle, ErrorApi>({
    queryKey: ['clientes', 'detalle', id],
    queryFn: () => obtenerCliente(id),
    staleTime: 0,
    retry: false,
  })
}
