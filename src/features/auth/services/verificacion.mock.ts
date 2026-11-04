// MOCK: eliminar al conectar el backend
import { esperar, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorAutenticacion, type RespuestaReenvio } from '../types/auth.types'
import type {
  PeticionVerificarCodigo,
  RespuestaVerificarCodigo,
} from '../types/verificacion.types'
import { TIEMPOS_CODIGO_MOCK, validarCodigoMock } from './codigo.mock'
import { ESTADO_VALIDACION_MOCK } from './sesion.mock'

export async function verificarCodigoLoginMock(
  peticion: PeticionVerificarCodigo,
): Promise<RespuestaVerificarCodigo> {
  await esperar()
  if (SIMULAR_ERROR_RED) throw new ErrorAutenticacion('red')
  validarCodigoMock(peticion.codigo)
  return { estadoValidacion: ESTADO_VALIDACION_MOCK }
}

export async function reenviarCodigoLoginMock(): Promise<RespuestaReenvio> {
  await esperar()
  if (SIMULAR_ERROR_RED) throw new ErrorAutenticacion('red')
  return { ...TIEMPOS_CODIGO_MOCK }
}
