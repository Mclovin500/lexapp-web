// PROVISIONAL: endpoints y nombres de campos por confirmar con el backend
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { USAR_MOCKS } from '@/api/mocks'
import { mapearErrorApi } from '../lib/mapear-error'
import type { RespuestaReenvio } from '../types/auth.types'
import type { PeticionVerificarCorreo } from '../types/verificacion-correo.types'

/** A3A: valida el código enviado al correo del registro (204). */
export async function verificarCorreo(peticion: PeticionVerificarCorreo): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { verificarCorreoMock } = await import('./verificacion-correo.mock')
    return verificarCorreoMock(peticion)
  }

  try {
    await api.post(ENDPOINTS.registro.verificarCorreo, peticion)
  } catch (error: unknown) {
    throw mapearErrorApi(error, 'codigo')
  }
}

/** A3A: pide un código nuevo; el backend invalida el anterior. */
export async function reenviarCodigoCorreo(): Promise<RespuestaReenvio> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { reenviarCodigoCorreoMock } = await import('./verificacion-correo.mock')
    return reenviarCodigoCorreoMock()
  }

  try {
    const respuesta = await api.post<RespuestaReenvio>(ENDPOINTS.registro.reenviarCodigo)
    return respuesta.data
  } catch (error: unknown) {
    throw mapearErrorApi(error, 'formulario')
  }
}
