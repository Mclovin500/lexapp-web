import { useQuery } from '@tanstack/react-query'
import { obtenerSesion } from '../services/sesion.service'
import type { EstadoSesion } from '../types/sesion.types'

export function useVerificarSesion() {
  return useQuery<EstadoSesion>({
    queryKey: ['auth', 'sesion'],
    queryFn: obtenerSesion,
    retry: false,
    staleTime: 0,
  })
}
