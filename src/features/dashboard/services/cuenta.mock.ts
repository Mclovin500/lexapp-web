// MOCK: eliminar al conectar el backend
import { esperar, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorApi } from '@/api/errores'
import { ESTADO_VALIDACION_MOCK } from '@/features/auth/services/sesion.mock'
import { contarSolicitudesNuevasMock } from '@/features/solicitudes/services/solicitudes.mock'
import type { CuentaAbogado } from '../types/cuenta.types'
import { contarNoLeidasMock } from './notificaciones.mock'

/** Mensajes sin leer del chat (H1 aún no existe). */
const MENSAJES_SIN_LEER_MOCK = 4

export async function obtenerCuentaMock(): Promise<CuentaAbogado> {
  await esperar(300)
  if (SIMULAR_ERROR_RED) throw new ErrorApi('red')
  return {
    nombreCompleto: 'Alejandro Morales Vega',
    tratamiento: 'Lic.',
    correo: 'alejandro.morales@despacho.mx',
    estadoValidacion: ESTADO_VALIDACION_MOCK,
    contadores: {
      solicitudesNuevas: contarSolicitudesNuevasMock(),
      mensajesSinLeer: MENSAJES_SIN_LEER_MOCK,
      notificacionesSinLeer: contarNoLeidasMock(),
    },
  }
}
