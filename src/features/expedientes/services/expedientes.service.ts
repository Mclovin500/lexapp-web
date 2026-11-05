// PROVISIONAL: endpoints y nombres de campos por confirmar con el backend (docs/contrato-api-expedientes.md)
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import type {
  ExpedienteDetalle,
  FiltrosExpedientes,
  OpcionExpediente,
  PeticionActualizacion,
  PeticionCambioEstado,
  RespuestaExpedientes,
} from '../types/expedientes.types'

const { expedientes } = ENDPOINTS

export async function listarOpcionesExpedientes(clienteId: string): Promise<OpcionExpediente[]> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarOpcionesExpedientesMock } = await import('./expedientes.mock')
    return listarOpcionesExpedientesMock(clienteId)
  }

  try {
    const respuesta = await api.get<OpcionExpediente[]>(expedientes.opciones, { params: { clienteId } })
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function listarExpedientes(filtros: FiltrosExpedientes): Promise<RespuestaExpedientes> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarExpedientesMock } = await import('./expedientes.mock')
    return listarExpedientesMock(filtros)
  }

  try {
    const respuesta = await api.get<RespuestaExpedientes>(expedientes.listado, {
      params: {
        estado: filtros.estado === 'todos' ? undefined : filtros.estado,
        area: filtros.area ?? undefined,
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

export async function obtenerExpediente(id: string): Promise<ExpedienteDetalle> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerExpedienteMock } = await import('./expediente-detalle.mock')
    return obtenerExpedienteMock(id)
  }

  try {
    const respuesta = await api.get<ExpedienteDetalle>(expedientes.detalle(id))
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function registrarActualizacion(id: string, peticion: PeticionActualizacion): Promise<{ id: string }> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { registrarActualizacionMock } = await import('./expedientes.mock')
    return registrarActualizacionMock(id, peticion)
  }

  try {
    const respuesta = await api.post<{ id: string }>(expedientes.actualizaciones(id), peticion)
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function cambiarEstadoExpediente(id: string, peticion: PeticionCambioEstado): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { cambiarEstadoExpedienteMock } = await import('./expedientes.mock')
    return cambiarEstadoExpedienteMock(id, peticion)
  }

  try {
    await api.patch(expedientes.estado(id), peticion)
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}
