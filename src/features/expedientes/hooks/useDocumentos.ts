import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import type { ErrorApi } from '@/api/errores'
import { cargarDocumento, listarDocumentos, obtenerUrlDocumento, revisarDocumento } from '../services/documentos.service'
import type {
  FiltrosDocumentos,
  PeticionCargaDocumento,
  PeticionRevisionDocumento,
  RespuestaDocumentos,
  UrlDocumento,
} from '../types/documentos.types'
import { CLAVE_EXPEDIENTES, useInvalidarExpedientes } from './useExpedientes'

export function useDocumentosExpediente(expedienteId: string, filtros: FiltrosDocumentos) {
  return useQuery<RespuestaDocumentos, ErrorApi>({
    queryKey: [...CLAVE_EXPEDIENTES, 'documentos', expedienteId, filtros],
    queryFn: () => listarDocumentos(expedienteId, filtros),
    placeholderData: keepPreviousData,
    staleTime: 0,
    retry: false,
  })
}

/** URL temporal para la vista previa: se pide al abrirla y no se guarda en caché. */
export function useUrlDocumento(expedienteId: string, documentoId: string | null) {
  return useQuery<UrlDocumento, ErrorApi>({
    queryKey: [...CLAVE_EXPEDIENTES, 'documentos', expedienteId, 'url', documentoId],
    queryFn: () => obtenerUrlDocumento(expedienteId, documentoId ?? ''),
    enabled: documentoId !== null,
    staleTime: 0,
    gcTime: 0,
    retry: false,
  })
}

/** Descarga: pide una URL nueva en cada clic. */
export function useDescargarDocumento(expedienteId: string) {
  return useMutation<UrlDocumento, ErrorApi, string>({
    mutationFn: (documentoId) => obtenerUrlDocumento(expedienteId, documentoId),
  })
}

export function useCargarDocumento(expedienteId: string) {
  const invalidar = useInvalidarExpedientes()
  return useMutation<{ id: string }, ErrorApi, PeticionCargaDocumento>({
    mutationFn: (peticion) => cargarDocumento(expedienteId, peticion),
    onSuccess: invalidar,
  })
}

export function useRevisarDocumento(expedienteId: string) {
  const invalidar = useInvalidarExpedientes()
  return useMutation<void, ErrorApi, { documentoId: string; peticion: PeticionRevisionDocumento }>({
    mutationFn: ({ documentoId, peticion }) => revisarDocumento(expedienteId, documentoId, peticion),
    onSuccess: invalidar,
  })
}
