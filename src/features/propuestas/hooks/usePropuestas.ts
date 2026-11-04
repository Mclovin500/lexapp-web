import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ErrorApi } from '@/api/errores'
import { CLAVE_CUENTA } from '@/features/dashboard/hooks/useCuentaAbogado'
import { CLAVE_RESUMEN_DASHBOARD } from '@/features/dashboard/hooks/useResumenDashboard'
import {
  actualizarPropuesta,
  cancelarPropuesta,
  crearExpedienteDePropuesta,
  crearPropuesta,
  listarPropuestas,
  obtenerPropuesta,
} from '../services/propuestas.service'
import type {
  FiltrosPropuestas,
  PeticionPropuesta,
  PropuestaDetalle,
  RespuestaCrearExpediente,
  RespuestaGuardarPropuesta,
  RespuestaPropuestas,
} from '../types/propuestas.types'

const CLAVE_PROPUESTAS = ['propuestas'] as const

export function useListadoPropuestas(filtros: FiltrosPropuestas) {
  return useQuery<RespuestaPropuestas, ErrorApi>({
    queryKey: [...CLAVE_PROPUESTAS, 'listado', filtros],
    queryFn: () => listarPropuestas(filtros),
    placeholderData: keepPreviousData,
    retry: false,
  })
}

/** `id` vacío = no consulta (D1 en modo "nueva"). */
export function useDetallePropuesta(id: string) {
  return useQuery<PropuestaDetalle, ErrorApi>({
    queryKey: [...CLAVE_PROPUESTAS, 'detalle', id],
    queryFn: () => obtenerPropuesta(id),
    enabled: id !== '',
    retry: false,
  })
}

/** Una propuesta enviada cambia D2, el Dashboard, C1/C2 (solicitud atendida) y los contadores. */
function useInvalidarPropuestas() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: CLAVE_PROPUESTAS })
    void queryClient.invalidateQueries({ queryKey: ['solicitudes'] })
    void queryClient.invalidateQueries({ queryKey: CLAVE_RESUMEN_DASHBOARD })
    void queryClient.invalidateQueries({ queryKey: CLAVE_CUENTA })
  }
}

/** D1: crea (sin `id`) o actualiza un borrador (con `id`). */
export function useGuardarPropuesta(id: string | null) {
  const invalidar = useInvalidarPropuestas()
  return useMutation<RespuestaGuardarPropuesta, ErrorApi, PeticionPropuesta>({
    mutationFn: (peticion) => (id ? actualizarPropuesta(id, peticion) : crearPropuesta(peticion)),
    onSuccess: invalidar,
  })
}

export function useCancelarPropuesta() {
  const invalidar = useInvalidarPropuestas()
  return useMutation<void, ErrorApi, string>({
    mutationFn: cancelarPropuesta,
    onSuccess: invalidar,
  })
}

export function useCrearExpedienteDePropuesta() {
  const invalidar = useInvalidarPropuestas()
  return useMutation<RespuestaCrearExpediente, ErrorApi, string>({
    mutationFn: crearExpedienteDePropuesta,
    onSuccess: invalidar,
  })
}
