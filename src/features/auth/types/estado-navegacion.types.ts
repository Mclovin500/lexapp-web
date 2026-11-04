import type { ROUTES } from '@/app/routes'

/**
 * Datos que una pantalla entrega a la siguiente con `navigate(..., { state })`.
 * Viven solo en memoria del historial: nunca en storage ni en la URL.
 */

/** Rutas a las que A1 puede continuar (lista cerrada: evita redirigir a cualquier ruta). */
export type DestinoCarga =
  | typeof ROUTES.dashboard
  | typeof ROUTES.validationStatus
  | typeof ROUTES.register

/** A2A → A1 (→ B1 o A5A) y P03 → A1 (→ A3). */
export interface EstadoCarga {
  destino: DestinoCarga
}

/** P02 → A2A */
export interface EstadoVerificacionLogin {
  correoEnmascarado: string
  reenviarEnSegundos: number
  expiraEnSegundos: number
}

/** A3 → A3A (mismos datos que P02 → A2A). */
export type EstadoVerificacionCorreo = EstadoVerificacionLogin

/** A2B → A2C */
export interface EstadoCodigoRecuperacion {
  correo: string
  correoEnmascarado: string
  reenviarEnSegundos: number
  expiraEnSegundos: number
}

/** A2C → A2D (el token es de un solo uso y solo se usa en A2D). */
export interface EstadoNuevaContrasena {
  tokenRestablecimiento: string
}

/** A2D tras guardar: se reemplaza la entrada del historial para descartar el token. */
export interface EstadoContrasenaActualizada {
  contrasenaActualizada: true
}
