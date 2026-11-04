import { useMutation } from '@tanstack/react-query'
import { reenviarCodigoCorreo, verificarCorreo } from '../services/verificacion-correo.service'
import type { ErrorAutenticacion, RespuestaReenvio } from '../types/auth.types'
import type { PeticionVerificarCorreo } from '../types/verificacion-correo.types'

export function useVerificarCorreo() {
  return useMutation<void, ErrorAutenticacion, PeticionVerificarCorreo>({
    mutationFn: verificarCorreo,
  })
}

export function useReenviarCodigoCorreo() {
  return useMutation<RespuestaReenvio, ErrorAutenticacion, void>({
    mutationFn: reenviarCodigoCorreo,
  })
}
