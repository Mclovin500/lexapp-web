import { useQuery } from '@tanstack/react-query'
import type { ErrorApi } from '@/api/errores'
import { obtenerCuenta } from '../services/cuenta.service'
import type { CuentaAbogado } from '../types/cuenta.types'

export const CLAVE_CUENTA = ['abogado', 'cuenta'] as const

/** Datos del Header y contadores del Sidebar. Se invalida al leer notificaciones o rechazar solicitudes. */
export function useCuentaAbogado() {
  return useQuery<CuentaAbogado, ErrorApi>({
    queryKey: CLAVE_CUENTA,
    queryFn: obtenerCuenta,
    staleTime: 30_000,
    retry: false,
  })
}
