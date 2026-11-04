import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ErrorApi } from '@/api/errores'
import {
  listarNotificaciones,
  marcarNotificacionLeida,
  marcarTodasLeidas,
} from '../services/notificaciones.service'
import type { FiltroNotificaciones, RespuestaNotificaciones } from '../types/notificaciones.types'
import { CLAVE_CUENTA } from './useCuentaAbogado'

const CLAVE_NOTIFICACIONES = ['notificaciones'] as const

export function useNotificaciones(filtro: FiltroNotificaciones) {
  return useQuery<RespuestaNotificaciones, ErrorApi>({
    queryKey: [...CLAVE_NOTIFICACIONES, filtro],
    queryFn: () => listarNotificaciones(filtro),
    staleTime: 0,
    retry: false,
  })
}

/** Refresca el listado y el contador de la campana del Header. */
function useInvalidarNotificaciones() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: CLAVE_NOTIFICACIONES })
    void queryClient.invalidateQueries({ queryKey: CLAVE_CUENTA })
  }
}

export function useMarcarNotificacionLeida() {
  const invalidar = useInvalidarNotificaciones()
  return useMutation<void, ErrorApi, string>({
    mutationFn: marcarNotificacionLeida,
    onSuccess: invalidar,
  })
}

export function useMarcarTodasLeidas() {
  const invalidar = useInvalidarNotificaciones()
  return useMutation<void, ErrorApi, void>({
    mutationFn: marcarTodasLeidas,
    onSuccess: invalidar,
  })
}
