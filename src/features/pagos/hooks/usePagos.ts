import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ErrorApi } from '@/api/errores'
import { CLAVE_RESUMEN_DASHBOARD } from '@/features/dashboard/hooks/useResumenDashboard'
import {
  crearCobroAdicional,
  listarMovimientos,
  obtenerMovimiento,
  obtenerResumenHonorarios,
} from '../services/pagos.service'
import type {
  FiltrosMovimientos,
  MovimientoDetalle,
  PeticionCobroAdicional,
  RespuestaCobroAdicional,
  RespuestaMovimientos,
  ResumenHonorarios,
} from '../types/pagos.types'

const CLAVE_HONORARIOS = ['honorarios'] as const

export function useResumenHonorarios() {
  return useQuery<ResumenHonorarios, ErrorApi>({
    queryKey: [...CLAVE_HONORARIOS, 'resumen'],
    queryFn: obtenerResumenHonorarios,
    staleTime: 0,
    retry: false,
  })
}

export function useMovimientos(filtros: FiltrosMovimientos) {
  return useQuery<RespuestaMovimientos, ErrorApi>({
    queryKey: [...CLAVE_HONORARIOS, 'movimientos', filtros],
    queryFn: () => listarMovimientos(filtros),
    placeholderData: keepPreviousData,
    retry: false,
  })
}

export function useMovimiento(id: string) {
  return useQuery<MovimientoDetalle, ErrorApi>({
    queryKey: [...CLAVE_HONORARIOS, 'movimiento', id],
    queryFn: () => obtenerMovimiento(id),
    retry: false,
  })
}

export function useCrearCobroAdicional() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaCobroAdicional, ErrorApi, PeticionCobroAdicional>({
    mutationFn: crearCobroAdicional,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CLAVE_HONORARIOS })
      void queryClient.invalidateQueries({ queryKey: CLAVE_RESUMEN_DASHBOARD })
    },
  })
}
