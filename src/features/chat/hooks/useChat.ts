import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ErrorApi } from '@/api/errores'
import { CLAVE_CUENTA } from '@/features/dashboard/hooks/useCuentaAbogado'
import {
  abrirConversacion,
  enviarMensaje,
  listarConversaciones,
  marcarConversacionLeida,
  obtenerMensajes,
  obtenerUrlAdjunto,
} from '../services/chat.service'
import type {
  FiltroConversaciones,
  Mensaje,
  PeticionAbrirConversacion,
  PeticionMensaje,
  RespuestaConversaciones,
  RespuestaMensajes,
} from '../types/chat.types'

const CLAVE_CHAT = ['conversaciones'] as const
/** TODO: reemplazar la consulta periódica por WebSocket cuando exista en el backend. */
const INTERVALO_ACTUALIZACION_MS = 5000

export function useConversaciones(filtro: FiltroConversaciones, busqueda: string) {
  return useQuery<RespuestaConversaciones, ErrorApi>({
    queryKey: [...CLAVE_CHAT, 'listado', filtro, busqueda],
    queryFn: () => listarConversaciones(filtro, busqueda),
    placeholderData: keepPreviousData,
    refetchInterval: INTERVALO_ACTUALIZACION_MS,
    staleTime: 0,
    retry: false,
  })
}

/** `id` vacío = no hay conversación seleccionada. */
export function useMensajes(id: string) {
  return useQuery<RespuestaMensajes, ErrorApi>({
    queryKey: [...CLAVE_CHAT, 'mensajes', id],
    queryFn: () => obtenerMensajes(id),
    enabled: id !== '',
    refetchInterval: INTERVALO_ACTUALIZACION_MS,
    staleTime: 0,
    retry: false,
  })
}

function useInvalidarChat() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: CLAVE_CHAT })
    void queryClient.invalidateQueries({ queryKey: CLAVE_CUENTA })
  }
}

export function useAbrirConversacion() {
  const invalidar = useInvalidarChat()
  return useMutation<{ id: string }, ErrorApi, PeticionAbrirConversacion>({ mutationFn: abrirConversacion, onSuccess: invalidar })
}

export function useMarcarLeida() {
  const invalidar = useInvalidarChat()
  return useMutation<void, ErrorApi, string>({ mutationFn: marcarConversacionLeida, onSuccess: invalidar })
}

export function useEnviarMensaje(id: string) {
  const invalidar = useInvalidarChat()
  return useMutation<Mensaje, ErrorApi, PeticionMensaje>({ mutationFn: (peticion) => enviarMensaje(id, peticion), onSuccess: invalidar })
}

export function useDescargarAdjunto(id: string) {
  return useMutation<{ url: string; expiraEn: string }, ErrorApi, string>({ mutationFn: (adjuntoId) => obtenerUrlAdjunto(id, adjuntoId) })
}
