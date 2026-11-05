import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ErrorApi } from '@/api/errores'
import { CLAVE_RESUMEN_DASHBOARD } from '@/features/dashboard/hooks/useResumenDashboard'
import {
  cambiarEstadoExpediente,
  listarExpedientes,
  obtenerExpediente,
  registrarActualizacion,
} from '../services/expedientes.service'
import type {
  ExpedienteDetalle,
  FiltrosExpedientes,
  PeticionActualizacion,
  PeticionCambioEstado,
  RespuestaExpedientes,
} from '../types/expedientes.types'

export const CLAVE_EXPEDIENTES = ['expedientes'] as const

export function useListadoExpedientes(filtros: FiltrosExpedientes) {
  return useQuery<RespuestaExpedientes, ErrorApi>({
    queryKey: [...CLAVE_EXPEDIENTES, 'listado', filtros],
    queryFn: () => listarExpedientes(filtros),
    placeholderData: keepPreviousData,
    staleTime: 0,
    retry: false,
  })
}

export function useDetalleExpediente(id: string) {
  return useQuery<ExpedienteDetalle, ErrorApi>({
    queryKey: [...CLAVE_EXPEDIENTES, 'detalle', id],
    queryFn: () => obtenerExpediente(id),
    staleTime: 0,
    retry: false,
  })
}

/** Un cambio en el expediente se refleja en E1, E2, F1/F2 y el indicador del Dashboard. */
export function useInvalidarExpedientes() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: CLAVE_EXPEDIENTES })
    void queryClient.invalidateQueries({ queryKey: ['clientes'] })
    void queryClient.invalidateQueries({ queryKey: CLAVE_RESUMEN_DASHBOARD })
  }
}

export function useRegistrarActualizacion(id: string) {
  const invalidar = useInvalidarExpedientes()
  return useMutation<{ id: string }, ErrorApi, PeticionActualizacion>({
    mutationFn: (peticion) => registrarActualizacion(id, peticion),
    onSuccess: invalidar,
  })
}

export function useCambiarEstadoExpediente(id: string) {
  const invalidar = useInvalidarExpedientes()
  return useMutation<void, ErrorApi, PeticionCambioEstado>({
    mutationFn: (peticion) => cambiarEstadoExpediente(id, peticion),
    onSuccess: invalidar,
  })
}
