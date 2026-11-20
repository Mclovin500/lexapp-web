// Header y Sidebar: el backend no tiene `GET /abogado/cuenta`. Se arma con:
// `GET /auth/sesion` (correo y validación), `GET /abogado/validacion` (nombre),
// la bandeja de solicitudes, el dashboard de expedientes (mensajes sin leer) y `GET /notificaciones/conteo`.
// Los contadores que fallen quedan en 0; la foto aún no existe en el backend.
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import { aEstadoValidacion } from '@/features/auth/lib/estado-validacion'
import type { RespuestaSesion } from '@/features/auth/types/sesion.types'
import { obtenerDashboardExpedientesApi } from '@/features/expedientes/services/casos.api'
import { listarSolicitudes } from '@/features/solicitudes/services/solicitudes.service'
import type { CuentaAbogado } from '../types/cuenta.types'
import { contarNotificacionesNoLeidas } from './notificaciones.service'

function valorO<T>(resultado: PromiseSettledResult<T>, porDefecto: T): T {
  return resultado.status === 'fulfilled' ? resultado.value : porDefecto
}

/** Header y Sidebar: nombre del abogado y contadores (solicitudes, mensajes, notificaciones). */
export async function obtenerCuenta(): Promise<CuentaAbogado> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerCuentaMock } = await import('./cuenta.mock')
    return obtenerCuentaMock()
  }

  let sesion: RespuestaSesion
  try {
    sesion = (await api.get<RespuestaSesion>(ENDPOINTS.auth.sesion)).data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }

  const [validacion, solicitudes, expedientes, notificaciones] = await Promise.allSettled([
    api.get<{ nombreCompleto: string }>(ENDPOINTS.abogado.validacion).then((r) => r.data),
    listarSolicitudes({ estado: 'nueva', area: null, busqueda: '', pagina: 1, porPagina: 1 }),
    obtenerDashboardExpedientesApi(),
    contarNotificacionesNoLeidas(),
  ])

  const dashboard = valorO(expedientes, null)
  return {
    nombreCompleto: valorO(validacion, null)?.nombreCompleto || sesion.email,
    tratamiento: 'Lic.',
    correo: sesion.email,
    fotoUrl: null,
    estadoValidacion: aEstadoValidacion(sesion.estadoVerificacion),
    contadores: {
      solicitudesNuevas: valorO(solicitudes, null)?.total ?? 0,
      mensajesSinLeer: dashboard?.expedientes.reduce((total, e) => total + e.mensajesNoLeidos, 0) ?? 0,
      notificacionesSinLeer: valorO(notificaciones, 0),
    },
  }
}
