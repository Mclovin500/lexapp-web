// PROVISIONAL: endpoints y nombres de campos por confirmar con el backend
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { USAR_MOCKS } from '@/api/mocks'
import { mapearErrorApi } from '../lib/mapear-error'
import type { RespuestaReenvio } from '../types/auth.types'
import type {
  PeticionNuevaContrasena,
  PeticionReenviarCodigoRecuperacion,
  PeticionSolicitarRecuperacion,
  PeticionVerificarCodigoRecuperacion,
  RespuestaSolicitarRecuperacion,
  RespuestaVerificarCodigoRecuperacion,
} from '../types/recuperacion.types'

const { recuperacion } = ENDPOINTS.auth

/** A2B: solicita el código de recuperación. */
export async function solicitarRecuperacion(
  peticion: PeticionSolicitarRecuperacion,
): Promise<RespuestaSolicitarRecuperacion> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { solicitarRecuperacionMock } = await import('./recuperacion.mock')
    return solicitarRecuperacionMock(peticion)
  }

  try {
    const respuesta = await api.post<RespuestaSolicitarRecuperacion>(recuperacion.solicitar, peticion)
    return respuesta.data
  } catch (error: unknown) {
    throw mapearErrorApi(error, 'formulario')
  }
}

/** A2C: valida el código y recibe el token de restablecimiento. */
export async function verificarCodigoRecuperacion(
  peticion: PeticionVerificarCodigoRecuperacion,
): Promise<RespuestaVerificarCodigoRecuperacion> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { verificarCodigoRecuperacionMock } = await import('./recuperacion.mock')
    return verificarCodigoRecuperacionMock(peticion)
  }

  try {
    const respuesta = await api.post<RespuestaVerificarCodigoRecuperacion>(
      recuperacion.verificarCodigo,
      peticion,
    )
    return respuesta.data
  } catch (error: unknown) {
    throw mapearErrorApi(error, 'codigo')
  }
}

/** A2C: pide un código nuevo; el backend invalida el anterior. */
export async function reenviarCodigoRecuperacion(
  peticion: PeticionReenviarCodigoRecuperacion,
): Promise<RespuestaReenvio> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { reenviarCodigoRecuperacionMock } = await import('./recuperacion.mock')
    return reenviarCodigoRecuperacionMock(peticion)
  }

  try {
    const respuesta = await api.post<RespuestaReenvio>(recuperacion.reenviarCodigo, peticion)
    return respuesta.data
  } catch (error: unknown) {
    throw mapearErrorApi(error, 'formulario')
  }
}

/** A2D: guarda la nueva contraseña (204). */
export async function guardarNuevaContrasena(peticion: PeticionNuevaContrasena): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { guardarNuevaContrasenaMock } = await import('./recuperacion.mock')
    return guardarNuevaContrasenaMock(peticion)
  }

  try {
    await api.post(recuperacion.nuevaContrasena, peticion)
  } catch (error: unknown) {
    throw mapearErrorApi(error, 'formulario')
  }
}
