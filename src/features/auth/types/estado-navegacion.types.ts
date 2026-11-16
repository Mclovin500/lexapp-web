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

/** P02 → A1 (→ B1 o A5A) y P03 → A1 (→ A3). */
export interface EstadoCarga {
  destino: DestinoCarga
}

/** A5 (registro creado) o P02 (correo sin verificar) → A3A. */
export interface EstadoVerificacionCorreo {
  correo: string
  correoEnmascarado: string
  reenviarEnSegundos: number
  expiraEnSegundos: number
}

/** A2B → A2C */
export interface EstadoCodigoRecuperacion {
  correo: string
  correoEnmascarado: string
  reenviarEnSegundos: number
  expiraEnSegundos: number
}

/** A2C → A2D: el backend no emite token; A2D confirma con el correo y el código validado. */
export interface EstadoNuevaContrasena {
  correo: string
  codigo: string
}

/** A2D tras guardar: se reemplaza la entrada del historial para descartar el código. */
export interface EstadoContrasenaActualizada {
  contrasenaActualizada: true
}
