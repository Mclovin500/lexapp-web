import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ErrorApi } from '@/api/errores'
import { listarSolicitudesCambio, solicitarCambio } from '../services/solicitudes-cambio.service'
import type { PeticionCambio, SolicitudCambio } from '../types/solicitudes-cambio.types'

const CLAVE_CAMBIOS = ['perfil', 'solicitudes-cambio'] as const

export function useSolicitudesCambio() {
  return useQuery<SolicitudCambio[], ErrorApi>({ queryKey: CLAVE_CAMBIOS, queryFn: listarSolicitudesCambio, retry: false })
}

export function useSolicitarCambio() {
  const queryClient = useQueryClient()
  return useMutation<SolicitudCambio, ErrorApi, PeticionCambio>({
    mutationFn: solicitarCambio,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: CLAVE_CAMBIOS }),
  })
}
