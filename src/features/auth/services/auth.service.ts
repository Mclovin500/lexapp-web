// P02: POST /api/auth/login (AuthController). Devuelve el JWT directamente (sin código de 2 pasos).
import { isAxiosError } from 'axios'
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { USAR_MOCKS } from '@/api/mocks'
import { guardarToken } from '@/api/token'
import { aEstadoValidacion } from '../lib/estado-validacion'
import { mapearErrorApi, mensajeDelServidor } from '../lib/mapear-error'
import {
  ErrorAutenticacion,
  type CredencialesLogin,
  type RespuestaLogin,
  type RespuestaLoginApi,
  type TipoErrorAuth,
} from '../types/auth.types'

/** El 401 del login trae el motivo en `mensaje` (LoginService). */
function tipoPorMensajeLogin(mensaje: string | undefined): TipoErrorAuth {
  const texto = mensaje?.toLowerCase() ?? ''
  if (texto.includes('verificar tu email')) return 'correo_no_verificado'
  if (texto.includes('desactivada') || texto.includes('no está activa')) return 'cuenta_desactivada'
  return 'credenciales'
}

export async function iniciarSesion(credenciales: CredencialesLogin): Promise<RespuestaLogin> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { loginMock } = await import('./auth.mock')
    return loginMock(credenciales)
  }

  let datos: RespuestaLoginApi
  try {
    const respuesta = await api.post<RespuestaLoginApi>(ENDPOINTS.auth.login, {
      email: credenciales.correo,
      password: credenciales.contrasena,
    })
    datos = respuesta.data
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 401) {
      const servidor = mensajeDelServidor(error)
      throw new ErrorAutenticacion(tipoPorMensajeLogin(servidor), undefined, servidor)
    }
    throw mapearErrorApi(error, 'formulario', { 400: 'credenciales' })
  }

  // La web es solo para abogados: a clientes y administradores no se les guarda la sesión.
  if (datos.tipoUsuario !== 'abogado') {
    throw new ErrorAutenticacion('cuenta_no_abogado')
  }

  guardarToken(datos.token)
  return { estadoValidacion: aEstadoValidacion(datos.estadoVerificacion) }
}
