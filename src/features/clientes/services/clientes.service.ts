// PROVISIONAL: endpoints y nombres de campos por confirmar con el backend (docs/contrato-api-expedientes.md)
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import type { ClienteDetalle, FiltrosClientes, OpcionCliente, RespuestaClientes } from '../types/clientes.types'

const { clientes } = ENDPOINTS

export async function listarOpcionesClientes(): Promise<OpcionCliente[]> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarOpcionesClientesMock } = await import('./clientes.mock')
    return listarOpcionesClientesMock()
  }

  try {
    const respuesta = await api.get<OpcionCliente[]>(clientes.opciones)
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function listarClientes(filtros: FiltrosClientes): Promise<RespuestaClientes> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarClientesMock } = await import('./clientes-directorio.mock')
    return listarClientesMock(filtros)
  }

  try {
    const respuesta = await api.get<RespuestaClientes>(clientes.listado, {
      params: {
        estado: filtros.estado === 'todos' ? undefined : filtros.estado,
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

export async function obtenerCliente(id: string): Promise<ClienteDetalle> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerClienteMock } = await import('./clientes-directorio.mock')
    return obtenerClienteMock(id)
  }

  try {
    const respuesta = await api.get<ClienteDetalle>(clientes.detalle(id))
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}
