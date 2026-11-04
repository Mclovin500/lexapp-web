// MOCK: eliminar al conectar el backend
import { esperar, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorAutenticacion, type RespuestaReenvio } from '../types/auth.types'
import type {
  PeticionNuevaContrasena,
  PeticionReenviarCodigoRecuperacion,
  PeticionSolicitarRecuperacion,
  PeticionVerificarCodigoRecuperacion,
  RespuestaSolicitarRecuperacion,
  RespuestaVerificarCodigoRecuperacion,
} from '../types/recuperacion.types'
import { TIEMPOS_CODIGO_MOCK, validarCodigoMock } from './codigo.mock'

const TOKEN_RESTABLECIMIENTO_MOCK = 'mock-token-restablecimiento'

function enmascarar(correo: string): string {
  const [usuario, dominio] = correo.trim().toLowerCase().split('@')
  return `${usuario.charAt(0)}***@${dominio}`
}

async function simularRed(): Promise<void> {
  await esperar()
  if (SIMULAR_ERROR_RED) throw new ErrorAutenticacion('red')
}

/** Cualquier correo válido responde igual (no se revela si existe la cuenta). */
export async function solicitarRecuperacionMock(
  peticion: PeticionSolicitarRecuperacion,
): Promise<RespuestaSolicitarRecuperacion> {
  await simularRed()
  return { correoEnmascarado: enmascarar(peticion.correo), ...TIEMPOS_CODIGO_MOCK }
}

export async function verificarCodigoRecuperacionMock(
  peticion: PeticionVerificarCodigoRecuperacion,
): Promise<RespuestaVerificarCodigoRecuperacion> {
  await simularRed()
  validarCodigoMock(peticion.codigo)
  return { tokenRestablecimiento: TOKEN_RESTABLECIMIENTO_MOCK }
}

export async function reenviarCodigoRecuperacionMock(
  peticion: PeticionReenviarCodigoRecuperacion,
): Promise<RespuestaReenvio> {
  await simularRed()
  void peticion
  return { ...TIEMPOS_CODIGO_MOCK }
}

export async function guardarNuevaContrasenaMock(peticion: PeticionNuevaContrasena): Promise<void> {
  await simularRed()
  if (peticion.tokenRestablecimiento !== TOKEN_RESTABLECIMIENTO_MOCK) {
    throw new ErrorAutenticacion('sesion_expirada')
  }
}
