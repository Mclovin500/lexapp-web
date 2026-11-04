// MOCK: eliminar al conectar el backend
import { esperar, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorAutenticacion, type RespuestaReenvio } from '../types/auth.types'
import type { PeticionVerificarCorreo } from '../types/verificacion-correo.types'
import { TIEMPOS_CODIGO_MOCK, validarCodigoMock } from './codigo.mock'

async function simularRed(): Promise<void> {
  await esperar()
  if (SIMULAR_ERROR_RED) throw new ErrorAutenticacion('red')
}

export async function verificarCorreoMock(peticion: PeticionVerificarCorreo): Promise<void> {
  await simularRed()
  validarCodigoMock(peticion.codigo)
}

export async function reenviarCodigoCorreoMock(): Promise<RespuestaReenvio> {
  await simularRed()
  return { ...TIEMPOS_CODIGO_MOCK }
}
