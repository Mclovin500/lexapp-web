// PROVISIONAL: endpoint y nombres de campos por confirmar con el backend
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import type { CuentaAbogado } from '../types/cuenta.types'

/** Header y Sidebar: nombre del abogado y contadores (solicitudes, mensajes, notificaciones). */
export async function obtenerCuenta(): Promise<CuentaAbogado> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerCuentaMock } = await import('./cuenta.mock')
    return obtenerCuentaMock()
  }

  try {
    const respuesta = await api.get<CuentaAbogado>(ENDPOINTS.abogado.cuenta)
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}
