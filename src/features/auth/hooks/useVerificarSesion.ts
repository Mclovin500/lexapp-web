import { useQuery } from '@tanstack/react-query'
import { obtenerSesion } from '../services/sesion.service'
import type { EstadoSesion } from '../types/sesion.types'

/** `habilitado = false` evita la consulta (A1 con destino ya definido). */
export function useVerificarSesion(habilitado = true) {
  return useQuery<EstadoSesion>({
    enabled: habilitado,
    queryKey: ['auth', 'sesion'],
    queryFn: obtenerSesion,
    retry: false,
    staleTime: 0,
  })
}
