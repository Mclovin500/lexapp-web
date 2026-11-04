// MOCK: eliminar al conectar el backend
import { esperar, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorAutenticacion } from '../types/auth.types'
import type {
  CredencialesProfesionales,
  PerfilProfesional,
  ProgresoRegistro,
  RespuestaEnvioRegistro,
} from '../types/registro-profesional.types'

/** Cédula que el mock trata como ya registrada (409). */
const CEDULA_REGISTRADA = '1234567'

/** Progreso guardado en memoria mientras dura la pestaña (nunca en storage). */
const progresoMock: ProgresoRegistro = {}

async function simularRed(): Promise<void> {
  await esperar()
  if (SIMULAR_ERROR_RED) throw new ErrorAutenticacion('red')
}

export async function obtenerProgresoRegistroMock(): Promise<ProgresoRegistro> {
  await simularRed()
  return { ...progresoMock }
}

export async function guardarCredencialesMock(datos: CredencialesProfesionales): Promise<void> {
  await simularRed()
  if (datos.numeroCedula === CEDULA_REGISTRADA) throw new ErrorAutenticacion('conflicto')
  progresoMock.credenciales = { ...datos }
}

export async function guardarPerfilMock(datos: PerfilProfesional): Promise<void> {
  await simularRed()
  progresoMock.perfil = { ...datos, especializaciones: [...datos.especializaciones] }
}

export async function enviarRegistroMock(): Promise<RespuestaEnvioRegistro> {
  await simularRed()
  return {
    estadoValidacion: 'pendiente',
    folio: 'LEX-MOCK-000123',
    fechaEnvio: new Date().toISOString(),
  }
}
