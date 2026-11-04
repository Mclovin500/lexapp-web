// PROVISIONAL: endpoint y nombres de campos por confirmar con el backend
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { USAR_MOCKS } from '@/api/mocks'
import { mapearErrorApi } from '../lib/mapear-error'
import type { CredencialesLogin, RespuestaLogin } from '../types/auth.types'

export async function iniciarSesion(
  credenciales: CredencialesLogin,
): Promise<RespuestaLogin> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { loginMock } = await import('./auth.mock')
    return loginMock(credenciales)
  }

  try {
    const respuesta = await api.post<RespuestaLogin>(ENDPOINTS.auth.login, credenciales)
    return respuesta.data
  } catch (error: unknown) {
    throw mapearErrorApi(error, 'formulario', {
      400: 'credenciales',
      401: 'credenciales',
      403: 'cuenta_no_abogado',
    })
  }
}
