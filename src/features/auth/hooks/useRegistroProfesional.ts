import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  enviarRegistro,
  guardarCredenciales,
  guardarPerfil,
  obtenerProgresoRegistro,
} from '../services/registro-profesional.service'
import type { ErrorAutenticacion } from '../types/auth.types'
import type {
  CredencialesProfesionales,
  PerfilProfesional,
  ProgresoRegistro,
  RespuestaEnvioRegistro,
} from '../types/registro-profesional.types'

const CLAVE_PROGRESO = ['registro', 'progreso'] as const

/** A4 y A5: precarga de lo ya guardado. */
export function useProgresoRegistro() {
  return useQuery<ProgresoRegistro, ErrorAutenticacion>({
    queryKey: CLAVE_PROGRESO,
    queryFn: obtenerProgresoRegistro,
    staleTime: 0,
    retry: false,
  })
}

/** A4: guarda credenciales y actualiza la precarga en caché. */
export function useGuardarCredenciales() {
  const queryClient = useQueryClient()
  return useMutation<void, ErrorAutenticacion, CredencialesProfesionales>({
    mutationFn: guardarCredenciales,
    onSuccess: (_, credenciales) => {
      queryClient.setQueryData<ProgresoRegistro>(CLAVE_PROGRESO, (previo) => ({
        ...previo,
        credenciales,
      }))
    },
  })
}

/**
 * A5 "Crear mi cuenta": guarda el perfil y después envía el registro a validación.
 * PENDIENTE: confirmar con backend qué significa "crear cuenta" si la cuenta ya existe desde A3.
 */
export function useFinalizarRegistro() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaEnvioRegistro, ErrorAutenticacion, PerfilProfesional>({
    mutationFn: async (perfil) => {
      await guardarPerfil(perfil)
      return enviarRegistro()
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CLAVE_PROGRESO })
    },
  })
}
