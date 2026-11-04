// MOCK: eliminar al conectar el backend
import { ErrorAutenticacion } from '../types/auth.types'

/** Códigos de prueba (ver docs/mocks.md). */
const CODIGO_CORRECTO = '123456'
const CODIGO_VENCIDO = '000000'

/** Simula la validación de un código de 6 dígitos: 410 vencido, 400 incorrecto. */
export function validarCodigoMock(codigo: string): void {
  if (codigo === CODIGO_VENCIDO) throw new ErrorAutenticacion('codigo_vencido')
  if (codigo !== CODIGO_CORRECTO) throw new ErrorAutenticacion('codigo_incorrecto')
}

/** Tiempos que devuelve el mock al enviar o reenviar un código. */
export const TIEMPOS_CODIGO_MOCK = {
  reenviarEnSegundos: 30,
  expiraEnSegundos: 600,
}
