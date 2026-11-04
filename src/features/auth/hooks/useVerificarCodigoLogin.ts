import { useMutation } from '@tanstack/react-query'
import { reenviarCodigoLogin, verificarCodigoLogin } from '../services/verificacion.service'
import type { ErrorAutenticacion, RespuestaReenvio } from '../types/auth.types'
import type {
  PeticionVerificarCodigo,
  RespuestaVerificarCodigo,
} from '../types/verificacion.types'

export function useVerificarCodigoLogin() {
  return useMutation<RespuestaVerificarCodigo, ErrorAutenticacion, PeticionVerificarCodigo>({
    mutationFn: verificarCodigoLogin,
  })
}

export function useReenviarCodigoLogin() {
  return useMutation<RespuestaReenvio, ErrorAutenticacion, void>({
    mutationFn: reenviarCodigoLogin,
  })
}
