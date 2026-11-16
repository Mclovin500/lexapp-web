import type { RespuestaReenvio } from '../types/auth.types'

/**
 * El backend no devuelve tiempos al enviar un código: los códigos de verificación (A3A)
 * y de recuperación (A2C) vencen a los 15 minutos (VerificacionService / PasswordResetService).
 * La espera para "Reenviar" es solo de la UI.
 */
export const TIEMPOS_CODIGO: RespuestaReenvio = {
  reenviarEnSegundos: 60,
  expiraEnSegundos: 15 * 60,
}

/** `juan.perez@despacho.com` → `j*********@despacho.com` (el backend no lo enmascara). */
export function enmascararCorreo(correo: string): string {
  const [usuario, dominio] = correo.split('@')
  if (!usuario || !dominio) return correo
  return `${usuario[0]}${'*'.repeat(Math.max(usuario.length - 1, 2))}@${dominio}`
}
