import { useMutation } from '@tanstack/react-query'
import {
  guardarNuevaContrasena,
  solicitarRecuperacion,
  verificarCodigoRecuperacion,
} from '../services/recuperacion.service'
import type { ErrorAutenticacion } from '../types/auth.types'
import type {
  PeticionNuevaContrasena,
  PeticionSolicitarRecuperacion,
  PeticionVerificarCodigoRecuperacion,
} from '../types/recuperacion.types'

/** A2B y "Reenviar" en A2C (el backend reenvía con el mismo endpoint). */
export function useSolicitarRecuperacion() {
  return useMutation<void, ErrorAutenticacion, PeticionSolicitarRecuperacion>({
    mutationFn: solicitarRecuperacion,
  })
}

/** A2C */
export function useVerificarCodigoRecuperacion() {
  return useMutation<void, ErrorAutenticacion, PeticionVerificarCodigoRecuperacion>({
    mutationFn: verificarCodigoRecuperacion,
  })
}

/** A2D */
export function useGuardarNuevaContrasena() {
  return useMutation<void, ErrorAutenticacion, PeticionNuevaContrasena>({
    mutationFn: guardarNuevaContrasena,
  })
}
