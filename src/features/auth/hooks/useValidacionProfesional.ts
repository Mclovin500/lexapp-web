import { useQuery } from '@tanstack/react-query'
import { obtenerValidacion } from '../services/validacion.service'
import type { ErrorAutenticacion } from '../types/auth.types'
import type { RespuestaValidacion } from '../types/validacion-profesional.types'

/** A5A: siempre consulta el estado actual; "Actualizar estado" llama a `refetch`. */
export function useValidacionProfesional() {
  return useQuery<RespuestaValidacion, ErrorAutenticacion>({
    queryKey: ['abogado', 'validacion'],
    queryFn: obtenerValidacion,
    staleTime: 0,
    retry: false,
  })
}
