import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ErrorApi } from '@/api/errores'
import {
  cambiarContrasena,
  cerrarOtrasSesiones,
  cerrarSesion,
  cerrarSesionRemota,
  guardarCuentaDeposito,
  guardarDatosPersonales,
  guardarNotificaciones,
  guardarPrivacidad,
  listarSesiones,
  obtenerCuentaDeposito,
  obtenerDatosPersonales,
  obtenerNotificaciones,
  obtenerPrivacidad,
  solicitarExportacion,
} from '../services/configuracion.service'
import type {
  CuentaDeposito,
  DatosPersonales,
  PeticionCambioContrasena,
  PeticionCuentaDeposito,
  PeticionDatosPersonales,
  PreferenciasNotificaciones,
  PreferenciasPrivacidad,
  SesionActiva,
} from '../types/configuracion.types'

const CLAVE = ['configuracion'] as const
const claves = {
  datos: [...CLAVE, 'datos'],
  sesiones: [...CLAVE, 'sesiones'],
  notificaciones: [...CLAVE, 'notificaciones'],
  privacidad: [...CLAVE, 'privacidad'],
  cuentaDeposito: [...CLAVE, 'cuenta-deposito'],
}

export function useDatosPersonales() {
  return useQuery<DatosPersonales, ErrorApi>({ queryKey: claves.datos, queryFn: obtenerDatosPersonales, retry: false })
}

export function useSesiones() {
  return useQuery<SesionActiva[], ErrorApi>({ queryKey: claves.sesiones, queryFn: listarSesiones, staleTime: 0, retry: false })
}

export function usePreferenciasNotificaciones() {
  return useQuery<PreferenciasNotificaciones, ErrorApi>({ queryKey: claves.notificaciones, queryFn: obtenerNotificaciones, retry: false })
}

export function usePreferenciasPrivacidad() {
  return useQuery<PreferenciasPrivacidad, ErrorApi>({ queryKey: claves.privacidad, queryFn: obtenerPrivacidad, retry: false })
}

/** Mientras está "pendiente" se consulta cada 5 s para mostrar el resultado de la verificación. */
export function useCuentaDeposito() {
  return useQuery<CuentaDeposito, ErrorApi>({
    queryKey: claves.cuentaDeposito,
    queryFn: obtenerCuentaDeposito,
    staleTime: 0,
    refetchInterval: (query) => (query.state.data?.estado === 'pendiente' ? 5000 : false),
    retry: false,
  })
}

function useMutacion<TVariables>(fn: (v: TVariables) => Promise<void>, clave: readonly string[]) {
  const queryClient = useQueryClient()
  return useMutation<void, ErrorApi, TVariables>({
    mutationFn: fn,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: clave }),
  })
}

export const useGuardarDatosPersonales = () => useMutacion<PeticionDatosPersonales>(guardarDatosPersonales, claves.datos)
/** Cambiar la contraseña cierra las demás sesiones: se recarga la lista. */
export const useCambiarContrasena = () => useMutacion<PeticionCambioContrasena>(cambiarContrasena, claves.sesiones)
export const useCerrarSesionRemota = () => useMutacion<string>(cerrarSesionRemota, claves.sesiones)
export const useCerrarOtrasSesiones = () => useMutacion<void>(() => cerrarOtrasSesiones(), claves.sesiones)
export const useGuardarNotificaciones = () => useMutacion<PreferenciasNotificaciones>(guardarNotificaciones, claves.notificaciones)
export const useGuardarPrivacidad = () => useMutacion<PreferenciasPrivacidad>(guardarPrivacidad, claves.privacidad)
export const useGuardarCuentaDeposito = () => useMutacion<PeticionCuentaDeposito>(guardarCuentaDeposito, claves.cuentaDeposito)

export function useSolicitarExportacion() {
  return useMutation<{ correo: string }, ErrorApi, void>({ mutationFn: () => solicitarExportacion() })
}

/** "Cerrar sesión" (J1 → P02): borra todos los datos en memoria de la sesión. */
export function useCerrarSesion() {
  const queryClient = useQueryClient()
  return useMutation<void, ErrorApi, void>({ mutationFn: () => cerrarSesion(), onSuccess: () => queryClient.clear() })
}
