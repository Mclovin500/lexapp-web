// MOCK: eliminar al conectar el backend
import { type DatosRegistro, type RespuestaRegistro, ErrorRegistro } from '../types/registro.types'

function enmascararCorreo(correo: string): string {
  const [usuario, dominio] = correo.split('@')
  return `${usuario.charAt(0)}***@${dominio}`
}

export async function registrarAbogadoMock(datos: DatosRegistro): Promise<RespuestaRegistro> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (datos.correo.trim().toLowerCase() === 'registrado@demo.com') {
    throw new ErrorRegistro('correo_registrado', 'El correo ya está registrado.')
  }

  return { correoEnmascarado: enmascararCorreo(datos.correo.trim().toLowerCase()) }
}
