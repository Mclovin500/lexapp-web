import type { EstadoValidacion } from '@/features/auth/types/sesion.types'

/** `GET /abogado/cuenta`: datos mínimos para el Header y los contadores del Sidebar. */
export interface CuentaAbogado {
  nombreCompleto: string
  /** Tratamiento profesional, p. ej. "Lic." (puede faltar). */
  tratamiento: string | null
  correo: string
  /** Foto del perfil profesional (I1); `null` = se muestran las iniciales. */
  fotoUrl: string | null
  estadoValidacion: EstadoValidacion
  contadores: {
    solicitudesNuevas: number
    mensajesSinLeer: number
    notificacionesSinLeer: number
  }
}
