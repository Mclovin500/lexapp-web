// PROVISIONAL: endpoints y nombres de campos por confirmar con el backend (docs/contrato-api-expedientes.md)
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import type {
  FiltrosDocumentos,
  PeticionCargaDocumento,
  PeticionRevisionDocumento,
  RespuestaDocumentos,
  UrlDocumento,
} from '../types/documentos.types'

const { expedientes } = ENDPOINTS

export async function listarDocumentos(expedienteId: string, filtros: FiltrosDocumentos): Promise<RespuestaDocumentos> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarDocumentosMock } = await import('./documentos.mock')
    return listarDocumentosMock(expedienteId, filtros)
  }

  try {
    const respuesta = await api.get<RespuestaDocumentos>(expedientes.documentos(expedienteId), {
      params: {
        estado: filtros.estado === 'todos' ? undefined : filtros.estado,
        categoria: filtros.categoria ?? undefined,
        busqueda: filtros.busqueda || undefined,
      },
    })
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** Envía el archivo como multipart/form-data (axios agrega el boundary). */
export async function cargarDocumento(expedienteId: string, peticion: PeticionCargaDocumento): Promise<{ id: string }> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { cargarDocumentoMock } = await import('./documentos.mock')
    return cargarDocumentoMock(expedienteId, peticion)
  }

  const datos = new FormData()
  datos.append('archivo', peticion.archivo)
  datos.append('categoria', peticion.categoria)
  datos.append('descripcion', peticion.descripcion)

  try {
    const respuesta = await api.post<{ id: string }>(expedientes.documentos(expedienteId), datos)
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function revisarDocumento(expedienteId: string, documentoId: string, peticion: PeticionRevisionDocumento): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { revisarDocumentoMock } = await import('./documentos.mock')
    return revisarDocumentoMock(expedienteId, documentoId, peticion)
  }

  try {
    await api.patch(expedientes.documento(expedienteId, documentoId), peticion)
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** URL temporal firmada; se pide cada vez para no exponer enlaces permanentes (9.4). */
export async function obtenerUrlDocumento(expedienteId: string, documentoId: string): Promise<UrlDocumento> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerUrlDocumentoMock } = await import('./documentos.mock')
    return obtenerUrlDocumentoMock(expedienteId, documentoId)
  }

  try {
    const respuesta = await api.get<UrlDocumento>(expedientes.urlDocumento(expedienteId, documentoId))
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}
