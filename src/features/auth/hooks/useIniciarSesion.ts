import { useMutation } from '@tanstack/react-query'
import { iniciarSesion } from '../services/auth.service'
import type {
  CredencialesLogin,
  RespuestaLogin,
  ErrorAutenticacion,
} from '../types/auth.types'

export function useIniciarSesion() {
  return useMutation<RespuestaLogin, ErrorAutenticacion, CredencialesLogin>({
    mutationFn: iniciarSesion,
  })
}

