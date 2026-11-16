// A3A: POST /api/Verificacion/enviar y /verificar (VerificacionController).
// Ambos responden `ApiResponse { exito, mensaje }`: 200 si `exito`, 400 si no.
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { USAR_MOCKS } from '@/api/mocks'
import { mapearErrorApi } from '../lib/mapear-error'
import type { PeticionEnviarCodigoCorreo, PeticionVerificarCorreo } from '../types/verificacion-correo.types'

/** Envía (o reenvía) el código de 6 dígitos; el backend invalida los anteriores. */
export async function enviarCodigoCorreo(peticion: PeticionEnviarCodigoCorreo): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { enviarCodigoCorreoMock } = await import('./verificacion-correo.mock')
    return enviarCodigoCorreoMock(peticion)
  }

  try {
    await api.post(ENDPOINTS.verificacion.enviar, { email: peticion.correo })
  } catch (error: unknown) {
    throw mapearErrorApi(error, 'formulario')
  }
}

/** Valida el código. Correcto → el correo queda verificado y ya se puede iniciar sesión. */
export async function verificarCorreo(peticion: PeticionVerificarCorreo): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { verificarCorreoMock } = await import('./verificacion-correo.mock')
    return verificarCorreoMock(peticion)
  }

  try {
    await api.post(ENDPOINTS.verificacion.verificar, { email: peticion.correo, codigo: peticion.codigo })
  } catch (error: unknown) {
    throw mapearErrorApi(error, 'codigo')
  }
}
