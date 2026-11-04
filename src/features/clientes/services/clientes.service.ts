// PROVISIONAL: endpoint y nombres de campos por confirmar con el backend
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import type { OpcionCliente } from '../types/clientes.types'

export async function listarOpcionesClientes(): Promise<OpcionCliente[]> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarOpcionesClientesMock } = await import('./clientes.mock')
    return listarOpcionesClientesMock()
  }

  try {
    const respuesta = await api.get<OpcionCliente[]>(ENDPOINTS.clientes.opciones)
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}
