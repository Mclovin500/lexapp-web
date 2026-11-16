import { useMutation, useQueryClient } from '@tanstack/react-query'
import { iniciarSesion } from '../services/auth.service'
import type { CredencialesLogin, ErrorAutenticacion, RespuestaLogin } from '../types/auth.types'

/** Inicia sesión y descarta la sesión en caché para que A1/RutaProtegida la consulten de nuevo. */
export function useIniciarSesion() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaLogin, ErrorAutenticacion, CredencialesLogin>({
    mutationFn: iniciarSesion,
    onSuccess: () => queryClient.removeQueries({ queryKey: ['auth', 'sesion'] }),
  })
}
