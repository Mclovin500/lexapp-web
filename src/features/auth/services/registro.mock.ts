// MOCK: eliminar al conectar el backend
import { esperar, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorAutenticacion } from '../types/auth.types'
import type { DatosRegistroAbogado, RespuestaRegistro } from '../types/registro.types'

/** Correo y cédula que el mock trata como ya registrados (409). */
const CORREO_REGISTRADO = 'registrado@demo.com'
const CEDULA_REGISTRADA = '1234567'

export async function registrarAbogadoMock(datos: DatosRegistroAbogado): Promise<RespuestaRegistro> {
  await esperar()
  if (SIMULAR_ERROR_RED) throw new ErrorAutenticacion('red')

  if (datos.correo === CORREO_REGISTRADO) {
    throw new ErrorAutenticacion('conflicto', undefined, 'Ya existe un usuario con ese email.')
  }
  if (datos.cedulaProfesional === CEDULA_REGISTRADA) {
    throw new ErrorAutenticacion('conflicto', undefined, 'Ya existe un abogado con esa cédula profesional.')
  }

  return {
    idUsuario: 1,
    idPerfil: 1,
    tipoUsuario: 'abogado',
    email: datos.correo,
    mensaje: 'Abogado registrado correctamente. Queda pendiente de verificación.',
    estadoDocumento: 'PENDIENTE',
  }
}
