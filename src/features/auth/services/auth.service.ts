// PROVISIONAL: endpoint y nombres de campos por confirmar con el backend
import { isAxiosError } from 'axios'
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import {
  type CredencialesLogin,
  type RespuestaLogin,
  ErrorAutenticacion,
} from '../types/auth.types'

export async function iniciarSesion(
  credenciales: CredencialesLogin,
): Promise<RespuestaLogin> {
  if (import.meta.env.DEV && import.meta.env.VITE_USAR_MOCKS === 'true') {
    const { loginMock } = await import('./auth.mock')
    return loginMock(credenciales)
  }

  try {
    const respuesta = await api.post<RespuestaLogin>(ENDPOINTS.auth.login, credenciales)
    return respuesta.data
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      if (!error.response) {
        throw new ErrorAutenticacion('red', 'Sin conexión con el servidor')
      }

      const status = error.response.status
      if (status === 400 || status === 401) {
        throw new ErrorAutenticacion('credenciales', 'Credenciales inválidas')
      }
      if (status === 403) {
        throw new ErrorAutenticacion('cuenta_no_abogado', 'Cuenta no autorizada para abogados')
      }
      if (status === 429) {
        throw new ErrorAutenticacion('demasiados_intentos', 'Demasiados intentos')
      }

      throw new ErrorAutenticacion('desconocido', 'Error inesperado')
    }

    if (error instanceof ErrorAutenticacion) {
      throw error
    }

    throw new ErrorAutenticacion('desconocido', 'Error inesperado')
  }
}

