// PROVISIONAL: endpoints y nombres de campos por confirmar con el backend (docs/contrato-api-perfil-configuracion.md)
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import type { PerfilAbogado, PeticionPerfil } from '../types/perfil.types'

const { abogado } = ENDPOINTS

export async function obtenerPerfil(): Promise<PerfilAbogado> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerPerfilMock } = await import('./perfil.mock')
    return obtenerPerfilMock()
  }

  try {
    const respuesta = await api.get<PerfilAbogado>(abogado.perfil)
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function guardarPerfil(peticion: PeticionPerfil): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { guardarPerfilMock } = await import('./perfil.mock')
    return guardarPerfilMock(peticion)
  }

  try {
    await api.put(abogado.perfil, peticion)
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function subirFoto(archivo: File): Promise<{ fotoUrl: string }> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { subirFotoMock } = await import('./perfil.mock')
    return subirFotoMock(archivo)
  }

  const datos = new FormData()
  datos.append('foto', archivo)
  try {
    const respuesta = await api.post<{ fotoUrl: string }>(abogado.foto, datos)
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function eliminarFoto(): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { eliminarFotoMock } = await import('./perfil.mock')
    return eliminarFotoMock()
  }

  try {
    await api.delete(abogado.foto)
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}
