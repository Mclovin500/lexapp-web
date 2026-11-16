import { useMutation } from '@tanstack/react-query'
import { enviarCodigoCorreo, verificarCorreo } from '../services/verificacion-correo.service'
import type { ErrorAutenticacion } from '../types/auth.types'
import type { PeticionEnviarCodigoCorreo, PeticionVerificarCorreo } from '../types/verificacion-correo.types'

export function useVerificarCorreo() {
  return useMutation<void, ErrorAutenticacion, PeticionVerificarCorreo>({
    mutationFn: verificarCorreo,
  })
}

/** Envío y reenvío del código (A3A, y P02 cuando el correo no está verificado). */
export function useEnviarCodigoCorreo() {
  return useMutation<void, ErrorAutenticacion, PeticionEnviarCodigoCorreo>({
    mutationFn: enviarCodigoCorreo,
  })
}
