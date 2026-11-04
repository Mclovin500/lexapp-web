import { useQuery } from '@tanstack/react-query'
import type { ErrorApi } from '@/api/errores'
import { listarOpcionesExpedientes } from '../services/expedientes.service'
import type { OpcionExpediente } from '../types/expedientes.types'

/** Solo consulta cuando hay un cliente seleccionado. */
export function useOpcionesExpedientes(clienteId: string) {
  return useQuery<OpcionExpediente[], ErrorApi>({
    queryKey: ['expedientes', 'opciones', clienteId],
    queryFn: () => listarOpcionesExpedientes(clienteId),
    enabled: clienteId !== '',
    retry: false,
  })
}
