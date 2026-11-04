// PROVISIONAL: endpoints y nombres de campos por confirmar con el backend
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { USAR_MOCKS } from '@/api/mocks'
import { mapearErrorApi } from '../lib/mapear-error'
import type { RespuestaReenvio } from '../types/auth.types'
import type {
  PeticionVerificarCodigo,
  RespuestaVerificarCodigo,
} from '../types/verificacion.types'

/** A2A: valida el código del inicio de sesión. Si es correcto, el backend abre la sesión. */
export async function verificarCodigoLogin(
  peticion: PeticionVerificarCodigo,
): Promise<RespuestaVerificarCodigo> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { verificarCodigoLoginMock } = await import('./verificacion.mock')
    return verificarCodigoLoginMock(peticion)
  }

  try {
    const respuesta = await api.post<RespuestaVerificarCodigo>(
      ENDPOINTS.auth.verificarCodigo,
      peticion,
    )
    return respuesta.data
  } catch (error: unknown) {
    throw mapearErrorApi(error, 'codigo')
  }
}

/** A2A: pide un código nuevo; el backend invalida el anterior. */
export async function reenviarCodigoLogin(): Promise<RespuestaReenvio> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { reenviarCodigoLoginMock } = await import('./verificacion.mock')
    return reenviarCodigoLoginMock()
  }

  try {
    const respuesta = await api.post<RespuestaReenvio>(ENDPOINTS.auth.reenviarCodigo)
    return respuesta.data
  } catch (error: unknown) {
    throw mapearErrorApi(error, 'formulario')
  }
}
