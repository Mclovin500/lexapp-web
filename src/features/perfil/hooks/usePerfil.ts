import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ErrorApi } from '@/api/errores'
import { CLAVE_CUENTA } from '@/features/dashboard/hooks/useCuentaAbogado'
import { eliminarFoto, guardarPerfil, obtenerPerfil, subirFoto } from '../services/perfil.service'
import type { PerfilAbogado, PeticionPerfil } from '../types/perfil.types'

export const CLAVE_PERFIL = ['abogado', 'perfil'] as const

export function usePerfil() {
  return useQuery<PerfilAbogado, ErrorApi>({ queryKey: CLAVE_PERFIL, queryFn: obtenerPerfil, staleTime: 0, retry: false })
}

/** El perfil y la foto también se muestran en el Header (cuenta). */
function useInvalidarPerfil() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: CLAVE_PERFIL })
    void queryClient.invalidateQueries({ queryKey: CLAVE_CUENTA })
  }
}

export function useGuardarPerfil() {
  const invalidar = useInvalidarPerfil()
  return useMutation<void, ErrorApi, PeticionPerfil>({ mutationFn: guardarPerfil, onSuccess: invalidar })
}

export function useSubirFoto() {
  const invalidar = useInvalidarPerfil()
  return useMutation<{ fotoUrl: string }, ErrorApi, File>({ mutationFn: subirFoto, onSuccess: invalidar })
}

export function useEliminarFoto() {
  const invalidar = useInvalidarPerfil()
  return useMutation<void, ErrorApi, void>({ mutationFn: eliminarFoto, onSuccess: invalidar })
}
