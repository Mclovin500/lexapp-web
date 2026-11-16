// MOCK: eliminar al conectar el backend
import { type CredencialesLogin, type RespuestaLogin, ErrorAutenticacion } from '../types/auth.types'
import { ESTADO_VALIDACION_MOCK, iniciarSesionMock } from './sesion.mock'

/** Usuarios de prueba (ver docs/mocks.md). */
export async function loginMock(credenciales: CredencialesLogin): Promise<RespuestaLogin> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const correoNormalizado = credenciales.correo.trim().toLowerCase()

  if (correoNormalizado === 'abogado@demo.com' && credenciales.contrasena === 'Demo1234!') {
    iniciarSesionMock()
    return { estadoValidacion: ESTADO_VALIDACION_MOCK }
  }

  if (correoNormalizado === 'sinverificar@demo.com' && credenciales.contrasena === 'Demo1234!') {
    throw new ErrorAutenticacion('correo_no_verificado')
  }

  if (correoNormalizado === 'cliente@demo.com' && credenciales.contrasena === 'Demo1234!') {
    throw new ErrorAutenticacion('cuenta_no_abogado', 'Esta plataforma es exclusiva para abogados.')
  }

  throw new ErrorAutenticacion('credenciales', 'Correo o contraseña incorrectos.')
}
