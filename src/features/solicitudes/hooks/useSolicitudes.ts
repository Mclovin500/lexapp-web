import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ErrorApi } from '@/api/errores'
import { CLAVE_CUENTA } from '@/features/dashboard/hooks/useCuentaAbogado'
import { CLAVE_RESUMEN_DASHBOARD } from '@/features/dashboard/hooks/useResumenDashboard'
import {
  listarOpcionesSolicitudes,
  obtenerUrlDocumentoSolicitud,
  listarSolicitudes,
  obtenerSolicitud,
  rechazarSolicitud,
  revisarSolicitud,
} from '../services/solicitudes.service'
import type {
  FiltrosSolicitudes,
  OpcionSolicitud,
  PeticionRechazoSolicitud,
  RespuestaListadoSolicitudes,
  SolicitudDetalle,
  UrlDocumentoSolicitud,
} from '../types/solicitudes.types'

const CLAVE_SOLICITUDES = ['solicitudes'] as const

/** C1: el listado se conserva mientras carga la siguiente página o filtro. */
export function useListadoSolicitudes(filtros: FiltrosSolicitudes) {
  return useQuery<RespuestaListadoSolicitudes, ErrorApi>({
    queryKey: [...CLAVE_SOLICITUDES, 'listado', filtros],
    queryFn: () => listarSolicitudes(filtros),
    placeholderData: keepPreviousData,
    retry: false,
  })
}

/** D1: solo consulta con un cliente seleccionado. */
export function useOpcionesSolicitudes(clienteId: string) {
  return useQuery<OpcionSolicitud[], ErrorApi>({
    queryKey: [...CLAVE_SOLICITUDES, 'opciones', clienteId],
    queryFn: () => listarOpcionesSolicitudes(clienteId),
    enabled: clienteId !== '',
    retry: false,
  })
}

/** C2 */
export function useDetalleSolicitud(id: string) {
  return useQuery<SolicitudDetalle, ErrorApi>({
    queryKey: [...CLAVE_SOLICITUDES, 'detalle', id],
    queryFn: () => obtenerSolicitud(id),
    retry: false,
  })
}

/** C2 vista previa: URL temporal que se pide al abrirla y no se guarda en caché. */
export function useUrlDocumentoSolicitud(solicitudId: string, documentoId: string | null) {
  return useQuery<UrlDocumentoSolicitud, ErrorApi>({
    queryKey: [...CLAVE_SOLICITUDES, 'documento-url', solicitudId, documentoId],
    queryFn: () => obtenerUrlDocumentoSolicitud(solicitudId, documentoId ?? ''),
    enabled: documentoId !== null,
    staleTime: 0,
    gcTime: 0,
    retry: false,
  })
}

/** C2 descargar: pide una URL nueva en cada clic. */
export function useDescargarDocumentoSolicitud(solicitudId: string) {
  return useMutation<UrlDocumentoSolicitud, ErrorApi, string>({
    mutationFn: (documentoId) => obtenerUrlDocumentoSolicitud(solicitudId, documentoId),
  })
}

/** Tras cambiar el estado: se refrescan C1, C2, el Dashboard y los contadores del Sidebar. */
function useInvalidarSolicitudes() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: CLAVE_SOLICITUDES })
    void queryClient.invalidateQueries({ queryKey: CLAVE_RESUMEN_DASHBOARD })
    void queryClient.invalidateQueries({ queryKey: CLAVE_CUENTA })
  }
}

export function useRevisarSolicitud(id: string) {
  const invalidar = useInvalidarSolicitudes()
  return useMutation<void, ErrorApi, void>({
    mutationFn: () => revisarSolicitud(id),
    onSuccess: invalidar,
  })
}

export function useRechazarSolicitud(id: string) {
  const invalidar = useInvalidarSolicitudes()
  return useMutation<void, ErrorApi, PeticionRechazoSolicitud>({
    mutationFn: (peticion) => rechazarSolicitud(id, peticion),
    onSuccess: invalidar,
  })
}
