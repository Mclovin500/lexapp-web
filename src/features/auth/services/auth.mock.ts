// MOCK: eliminar al conectar el backend
import {
  type CredencialesLogin,
  type RespuestaLogin,
  ErrorAutenticacion,
} from '../types/auth.types'

export async function loginMock(credenciales: CredencialesLogin): Promise<RespuestaLogin> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const correoNormalizado = credenciales.correo.trim().toLowerCase()

  if (correoNormalizado === 'abogado@demo.com' && credenciales.contrasena === 'Demo1234!') {
    return {
      requiereCodigo: true,
      correoEnmascarado: 'a***@demo.com',
    }
  }

  if (correoNormalizado === 'cliente@demo.com' && credenciales.contrasena === 'Demo1234!') {
    throw new ErrorAutenticacion('cuenta_no_abogado', 'Esta plataforma es exclusiva para abogados.')
  }

  throw new ErrorAutenticacion('credenciales', 'Correo o contraseña incorrectos.')
}

