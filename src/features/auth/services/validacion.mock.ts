// MOCK: eliminar al conectar el backend
import { esperar, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorAutenticacion } from '../types/auth.types'
import type { EstadoValidacion } from '../types/sesion.types'
import type { RespuestaValidacion } from '../types/validacion-profesional.types'
import { ESTADO_VALIDACION_MOCK } from './sesion.mock'

const ESTADOS: EstadoValidacion[] = ['pendiente', 'validado', 'requiere_correccion', 'rechazado']

function esEstado(valor: string | null): valor is EstadoValidacion {
  return valor !== null && ESTADOS.some((estado) => estado === valor)
}

/** Solo en mocks: `?estado=pendiente|validado|requiere_correccion|rechazado` sobrescribe la constante. */
function estadoMock(): EstadoValidacion {
  const parametro = new URLSearchParams(window.location.search).get('estado')
  return esEstado(parametro) ? parametro : ESTADO_VALIDACION_MOCK
}

const MOTIVOS: Partial<Record<EstadoValidacion, string>> = {
  requiere_correccion:
    'El número de cédula no coincide con el nombre registrado. Revisa tus credenciales y tu perfil.',
  rechazado: 'No fue posible confirmar la cédula profesional con los registros oficiales.',
}

export async function obtenerValidacionMock(): Promise<RespuestaValidacion> {
  await esperar()
  if (SIMULAR_ERROR_RED) throw new ErrorAutenticacion('red')

  const estado = estadoMock()
  return {
    estado,
    folio: 'LEX-MOCK-000123',
    fechaEnvio: '2026-11-03T17:42:00.000Z',
    nombreCompleto: 'Alejandro Morales Vega',
    cedulaEnmascarada: '849•••••',
    especialidad: 'corporativo',
    motivo: MOTIVOS[estado] ?? null,
  }
}
