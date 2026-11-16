/**
 * JWT que devuelve `POST /auth/login`. Vive en sessionStorage (se borra al cerrar la pestaña)
 * y el cliente HTTP lo envía como `Authorization: Bearer`.
 */
const CLAVE_TOKEN = 'token'

export function leerToken(): string | null {
  try {
    return sessionStorage.getItem(CLAVE_TOKEN)
  } catch {
    return null
  }
}

export function guardarToken(token: string): void {
  try {
    sessionStorage.setItem(CLAVE_TOKEN, token)
  } catch {
    // Sin storage disponible: la sesión no persistirá entre recargas.
  }
}

export function borrarToken(): void {
  try {
    sessionStorage.removeItem(CLAVE_TOKEN)
  } catch {
    // Nada que borrar.
  }
}
