import { useQuery } from '@tanstack/react-query'
import type { ErrorApi } from '@/api/errores'
import { listarOpcionesClientes } from '../services/clientes.service'
import type { OpcionCliente } from '../types/clientes.types'

export function useOpcionesClientes() {
  return useQuery<OpcionCliente[], ErrorApi>({
    queryKey: ['clientes', 'opciones'],
    queryFn: listarOpcionesClientes,
    staleTime: 5 * 60_000,
    retry: false,
  })
}
