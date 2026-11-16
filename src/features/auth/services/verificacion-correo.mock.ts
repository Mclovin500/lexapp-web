// MOCK: eliminar al conectar el backend
import { esperar, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorAutenticacion } from '../types/auth.types'
import type { PeticionEnviarCodigoCorreo, PeticionVerificarCorreo } from '../types/verificacion-correo.types'
import { validarCodigoMock } from './codigo.mock'

async function simularRed(): Promise<void> {
  await esperar()
  if (SIMULAR_ERROR_RED) throw new ErrorAutenticacion('red')
}

export async function enviarCodigoCorreoMock(peticion: PeticionEnviarCodigoCorreo): Promise<void> {
  await simularRed()
  void peticion
}

export async function verificarCorreoMock(peticion: PeticionVerificarCorreo): Promise<void> {
  await simularRed()
  validarCodigoMock(peticion.codigo)
}
