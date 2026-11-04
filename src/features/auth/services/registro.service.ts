// PROVISIONAL: endpoint y nombres de campos por confirmar con el backend
import { isAxiosError } from 'axios'
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { USAR_MOCKS } from '@/api/mocks'
import { type DatosRegistro, type RespuestaRegistro, ErrorRegistro } from '../types/registro.types'

export async function registrarAbogado(datos: DatosRegistro): Promise<RespuestaRegistro> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { registrarAbogadoMock } = await import('./registro.mock')
    return registrarAbogadoMock(datos)
  }

  try {
    const respuesta = await api.post<RespuestaRegistro>(ENDPOINTS.auth.registro, datos)
    return respuesta.data
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      if (!error.response) {
        throw new ErrorRegistro('red', 'Sin conexión con el servidor')
      }

      const status = error.response.status
      if (status === 409) {
        throw new ErrorRegistro('correo_registrado', 'El correo ya está registrado')
      }
      if (status === 400 || status === 422) {
        throw new ErrorRegistro('datos_invalidos', 'Datos de registro inválidos')
      }
      if (status === 429) {
        throw new ErrorRegistro('demasiados_intentos', 'Demasiados intentos')
      }

      throw new ErrorRegistro('desconocido', 'Error inesperado')
    }

    if (error instanceof ErrorRegistro) {
      throw error
    }

    throw new ErrorRegistro('desconocido', 'Error inesperado')
  }
}
