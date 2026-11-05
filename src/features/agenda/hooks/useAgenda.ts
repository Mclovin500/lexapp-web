import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ErrorApi } from '@/api/errores'
import { CLAVE_RESUMEN_DASHBOARD } from '@/features/dashboard/hooks/useResumenDashboard'
import {
  cancelarReunion,
  crearReunionInmediata,
  entrarSala,
  finalizarReunion,
  guardarDisponibilidad,
  listarReuniones,
  obtenerDisponibilidad,
  obtenerReunion,
  programarReunion,
} from '../services/agenda.service'
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

export const CLAVE_REUNIONES = ['reuniones'] as const

export function useReuniones(filtros: FiltrosReuniones) {
  return useQuery<ReunionResumen[], ErrorApi>({
    queryKey: [...CLAVE_REUNIONES, 'listado', filtros],
    queryFn: () => listarReuniones(filtros),
    staleTime: 0,
    // El estado "En curso" depende de la hora: se refresca cada minuto.
    refetchInterval: 60_000,
    retry: false,
  })
}

/** `id` vacío = no consulta. */
export function useDetalleReunion(id: string) {
  return useQuery<ReunionDetalle, ErrorApi>({
    queryKey: [...CLAVE_REUNIONES, 'detalle', id],
    queryFn: () => obtenerReunion(id),
    enabled: id !== '',
    staleTime: 0,
    retry: false,
  })
}

export function useDisponibilidad(habilitada: boolean) {
  return useQuery<Disponibilidad, ErrorApi>({
    queryKey: ['agenda', 'disponibilidad'],
    queryFn: obtenerDisponibilidad,
    enabled: habilitada,
    retry: false,
  })
}

/** Una reunión nueva o finalizada cambia G1, B1 (próximas reuniones) y el historial de E2. */
function useInvalidarReuniones() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: CLAVE_REUNIONES })
    void queryClient.invalidateQueries({ queryKey: CLAVE_RESUMEN_DASHBOARD })
    void queryClient.invalidateQueries({ queryKey: ['expedientes'] })
  }
}

export function useProgramarReunion() {
  const invalidar = useInvalidarReuniones()
  return useMutation<{ id: string }, ErrorApi, PeticionReunion>({ mutationFn: programarReunion, onSuccess: invalidar })
}

export function useReunionInmediata() {
  const invalidar = useInvalidarReuniones()
  return useMutation<{ id: string }, ErrorApi, PeticionReunionInmediata>({ mutationFn: crearReunionInmediata, onSuccess: invalidar })
}

export function useCancelarReunion() {
  const invalidar = useInvalidarReuniones()
  return useMutation<void, ErrorApi, { id: string; motivo: string }>({
    mutationFn: ({ id, motivo }) => cancelarReunion(id, motivo),
    onSuccess: invalidar,
  })
}

export function useEntrarSala(id: string) {
  const invalidar = useInvalidarReuniones()
  return useMutation<AccesoSala, ErrorApi, void>({ mutationFn: () => entrarSala(id), onSuccess: invalidar })
}

export function useFinalizarReunion(id: string) {
  const invalidar = useInvalidarReuniones()
  return useMutation<void, ErrorApi, PeticionFinalizarReunion>({ mutationFn: (peticion) => finalizarReunion(id, peticion), onSuccess: invalidar })
}

export function useGuardarDisponibilidad() {
  const queryClient = useQueryClient()
  return useMutation<void, ErrorApi, Disponibilidad>({
    mutationFn: guardarDisponibilidad,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['agenda', 'disponibilidad'] }),
  })
}
