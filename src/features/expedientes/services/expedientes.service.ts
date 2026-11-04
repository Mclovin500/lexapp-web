// PROVISIONAL: endpoint y nombres de campos por confirmar con el backend
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import type { OpcionExpediente } from '../types/expedientes.types'

export async function listarOpcionesExpedientes(clienteId: string): Promise<OpcionExpediente[]> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarOpcionesExpedientesMock } = await import('./expedientes.mock')
    return listarOpcionesExpedientesMock(clienteId)
  }

  try {
    const respuesta = await api.get<OpcionExpediente[]>(ENDPOINTS.expedientes.opciones, { params: { clienteId } })
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}
