import { useMutation } from '@tanstack/react-query'
import {
  guardarNuevaContrasena,
  reenviarCodigoRecuperacion,
  solicitarRecuperacion,
  verificarCodigoRecuperacion,
} from '../services/recuperacion.service'
import type { ErrorAutenticacion, RespuestaReenvio } from '../types/auth.types'
import type {
  PeticionNuevaContrasena,
  PeticionReenviarCodigoRecuperacion,
  PeticionSolicitarRecuperacion,
  PeticionVerificarCodigoRecuperacion,
  RespuestaSolicitarRecuperacion,
  RespuestaVerificarCodigoRecuperacion,
} from '../types/recuperacion.types'

/** A2B */
export function useSolicitarRecuperacion() {
  return useMutation<RespuestaSolicitarRecuperacion, ErrorAutenticacion, PeticionSolicitarRecuperacion>({
    mutationFn: solicitarRecuperacion,
  })
}

/** A2C */
export function useVerificarCodigoRecuperacion() {
  return useMutation<
    RespuestaVerificarCodigoRecuperacion,
    ErrorAutenticacion,
    PeticionVerificarCodigoRecuperacion
  >({
    mutationFn: verificarCodigoRecuperacion,
  })
}

/** A2C */
export function useReenviarCodigoRecuperacion() {
  return useMutation<RespuestaReenvio, ErrorAutenticacion, PeticionReenviarCodigoRecuperacion>({
    mutationFn: reenviarCodigoRecuperacion,
  })
}

/** A2D */
export function useGuardarNuevaContrasena() {
  return useMutation<void, ErrorAutenticacion, PeticionNuevaContrasena>({
    mutationFn: guardarNuevaContrasena,
  })
}
