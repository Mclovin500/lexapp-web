// PROVISIONAL: endpoints y nombres de campos por confirmar con el backend
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import type {
  FiltrosMovimientos,
  MovimientoDetalle,
  PeticionCobroAdicional,
  RespuestaCobroAdicional,
  RespuestaMovimientos,
  ResumenHonorarios,
} from '../types/pagos.types'

const { honorarios } = ENDPOINTS

/** D3: resumen de ingresos. */
export async function obtenerResumenHonorarios(): Promise<ResumenHonorarios> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerResumenHonorariosMock } = await import('./pagos.mock')
    return obtenerResumenHonorariosMock()
  }

  try {
    const respuesta = await api.get<ResumenHonorarios>(honorarios.resumen)
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** D3: historial de cobros con filtros y paginación del lado del servidor. */
export async function listarMovimientos(filtros: FiltrosMovimientos): Promise<RespuestaMovimientos> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarMovimientosMock } = await import('./pagos.mock')
    return listarMovimientosMock(filtros)
  }

  try {
    const respuesta = await api.get<RespuestaMovimientos>(honorarios.movimientos, {
      params: {
        estado: filtros.estado === 'todos' ? undefined : filtros.estado,
        busqueda: filtros.busqueda || undefined,
        propuestaId: filtros.propuestaId ?? undefined,
        pagina: filtros.pagina,
        porPagina: filtros.porPagina,
      },
    })
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** D5: detalle de un movimiento (solo lectura). */
export async function obtenerMovimiento(id: string): Promise<MovimientoDetalle> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerMovimientoMock } = await import('./pagos.mock')
    return obtenerMovimientoMock(id)
  }

  try {
    const respuesta = await api.get<MovimientoDetalle>(honorarios.movimiento(id))
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** D4: crea el cobro adicional; el backend lo asocia al expediente y notifica al cliente. */
export async function crearCobroAdicional(peticion: PeticionCobroAdicional): Promise<RespuestaCobroAdicional> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { crearCobroAdicionalMock } = await import('./pagos.mock')
    return crearCobroAdicionalMock(peticion)
  }

  try {
    const respuesta = await api.post<RespuestaCobroAdicional>(honorarios.cobros, peticion)
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}
