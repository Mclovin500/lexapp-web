import { useQuery } from '@tanstack/react-query'
import type { ErrorApi } from '@/api/errores'
import { obtenerResumenDashboard } from '../services/dashboard.service'
import type { ResumenDashboard } from '../types/dashboard.types'

export const CLAVE_RESUMEN_DASHBOARD = ['dashboard', 'resumen'] as const

export function useResumenDashboard() {
  return useQuery<ResumenDashboard, ErrorApi>({
    queryKey: CLAVE_RESUMEN_DASHBOARD,
    queryFn: obtenerResumenDashboard,
    staleTime: 0,
    retry: false,
  })
}
