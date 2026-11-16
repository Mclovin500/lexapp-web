// MOCK: eliminar al conectar el backend
import { esperar, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorAutenticacion } from '../types/auth.types'
import type {
  PeticionNuevaContrasena,
  PeticionSolicitarRecuperacion,
  PeticionVerificarCodigoRecuperacion,
} from '../types/recuperacion.types'
import { validarCodigoMock } from './codigo.mock'

async function simularRed(): Promise<void> {
  await esperar()
  if (SIMULAR_ERROR_RED) throw new ErrorAutenticacion('red')
}

/** Cualquier correo válido responde igual (no se revela si existe la cuenta). */
export async function solicitarRecuperacionMock(peticion: PeticionSolicitarRecuperacion): Promise<void> {
  await simularRed()
  void peticion
}

export async function verificarCodigoRecuperacionMock(peticion: PeticionVerificarCodigoRecuperacion): Promise<void> {
  await simularRed()
  validarCodigoMock(peticion.codigo)
}

export async function guardarNuevaContrasenaMock(peticion: PeticionNuevaContrasena): Promise<void> {
  await simularRed()
  validarCodigoMock(peticion.codigo)
}
