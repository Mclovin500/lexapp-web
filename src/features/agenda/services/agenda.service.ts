// PROVISIONAL: endpoints y nombres de campos por confirmar con el backend (docs/contrato-api-agenda-chat.md)
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import type {
  AccesoSala,
  Disponibilidad,
  FiltrosReuniones,
  PeticionFinalizarReunion,
  PeticionReunion,
  PeticionReunionInmediata,
  ReunionDetalle,
  ReunionResumen,
} from '../types/agenda.types'

const { reuniones, agenda } = ENDPOINTS

export async function listarReuniones(filtros: FiltrosReuniones): Promise<ReunionResumen[]> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarReunionesMock } = await import('./reuniones.mock')
    return listarReunionesMock(filtros)
  }

  try {
    const respuesta = await api.get<ReunionResumen[]>(reuniones.listado, { params: filtros })
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function obtenerReunion(id: string): Promise<ReunionDetalle> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerReunionMock } = await import('./reuniones.mock')
    return obtenerReunionMock(id)
  }

  try {
    const respuesta = await api.get<ReunionDetalle>(reuniones.detalle(id))
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function programarReunion(peticion: PeticionReunion): Promise<{ id: string }> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { programarReunionMock } = await import('./reuniones.mock')
    return programarReunionMock(peticion)
  }

  try {
    const respuesta = await api.post<{ id: string }>(reuniones.listado, peticion)
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function crearReunionInmediata(peticion: PeticionReunionInmediata): Promise<{ id: string }> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { crearReunionInmediataMock } = await import('./reuniones.mock')
    return crearReunionInmediataMock(peticion)
  }

  try {
    const respuesta = await api.post<{ id: string }>(reuniones.inmediata, peticion)
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function cancelarReunion(id: string, motivo: string): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { cancelarReunionMock } = await import('./reuniones.mock')
    return cancelarReunionMock(id, motivo)
  }

  try {
    await api.post(reuniones.cancelar(id), { motivo })
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function entrarSala(id: string): Promise<AccesoSala> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { entrarSalaMock } = await import('./reuniones.mock')
    return entrarSalaMock(id)
  }

  try {
    const respuesta = await api.post<AccesoSala>(reuniones.sala(id))
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function finalizarReunion(id: string, peticion: PeticionFinalizarReunion): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { finalizarReunionMock } = await import('./reuniones.mock')
    return finalizarReunionMock(id, peticion)
  }

  try {
    await api.post(reuniones.finalizar(id), peticion)
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function obtenerDisponibilidad(): Promise<Disponibilidad> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerDisponibilidadMock } = await import('./reuniones.mock')
    return obtenerDisponibilidadMock()
  }

  try {
    const respuesta = await api.get<Disponibilidad>(agenda.disponibilidad)
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function guardarDisponibilidad(disponibilidad: Disponibilidad): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { guardarDisponibilidadMock } = await import('./reuniones.mock')
    return guardarDisponibilidadMock(disponibilidad)
  }

  try {
    await api.put(agenda.disponibilidad, disponibilidad)
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}
