// PROVISIONAL: endpoints y nombres de campos por confirmar con el backend
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import type {
  FiltrosPropuestas,
  PeticionPropuesta,
  PropuestaDetalle,
  RespuestaCrearExpediente,
  RespuestaGuardarPropuesta,
  RespuestaPropuestas,
} from '../types/propuestas.types'

const { propuestas } = ENDPOINTS

/** D2: seguimiento con filtros y paginación del lado del servidor. */
export async function listarPropuestas(filtros: FiltrosPropuestas): Promise<RespuestaPropuestas> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarPropuestasMock } = await import('./propuestas.mock')
    return listarPropuestasMock(filtros)
  }

  try {
    const respuesta = await api.get<RespuestaPropuestas>(propuestas.listado, {
      params: {
        estado: filtros.estado === 'todas' ? undefined : filtros.estado,
        busqueda: filtros.busqueda || undefined,
        pagina: filtros.pagina,
        porPagina: filtros.porPagina,
      },
    })
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** D2 "Ver propuesta" y D1 al editar un borrador. */
export async function obtenerPropuesta(id: string): Promise<PropuestaDetalle> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerPropuestaMock } = await import('./propuestas.mock')
    return obtenerPropuestaMock(id)
  }

  try {
    const respuesta = await api.get<PropuestaDetalle>(propuestas.detalle(id))
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** D1: crea la propuesta (borrador o enviada). */
export async function crearPropuesta(peticion: PeticionPropuesta): Promise<RespuestaGuardarPropuesta> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { crearPropuestaMock } = await import('./propuestas.mock')
    return crearPropuestaMock(peticion)
  }

  try {
    const respuesta = await api.post<RespuestaGuardarPropuesta>(propuestas.listado, peticion)
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** D1: actualiza un borrador (409 si ya no es borrador). */
export async function actualizarPropuesta(id: string, peticion: PeticionPropuesta): Promise<RespuestaGuardarPropuesta> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { actualizarPropuestaMock } = await import('./propuestas.mock')
    return actualizarPropuestaMock(id, peticion)
  }

  try {
    const respuesta = await api.put<RespuestaGuardarPropuesta>(propuestas.detalle(id), peticion)
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** D2: cancela un borrador o una propuesta sin respuesta (204). */
export async function cancelarPropuesta(id: string): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { cancelarPropuestaMock } = await import('./propuestas.mock')
    return cancelarPropuestaMock(id)
  }

  try {
    await api.post(propuestas.cancelar(id))
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** D2 → E2: crea o habilita el expediente de una propuesta aceptada (flujo 6.6). */
export async function crearExpedienteDePropuesta(id: string): Promise<RespuestaCrearExpediente> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { crearExpedienteMock } = await import('./propuestas.mock')
    return crearExpedienteMock(id)
  }

  try {
    const respuesta = await api.post<RespuestaCrearExpediente>(propuestas.crearExpediente(id))
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}
