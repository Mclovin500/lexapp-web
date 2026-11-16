import type { CredencialesFormValues } from '../schemas/credenciales.schema'
import type { PerfilProfesionalFormValues } from '../schemas/perfil-profesional.schema'
import type { RegistroFormValues } from '../schemas/registro.schema'

/**
 * Borrador del registro en memoria (A3 → A4 → A5).
 * El backend crea la cuenta en una sola petición (`POST /Registro/abogado`), así que lo
 * capturado en cada paso se guarda aquí hasta "Crear mi cuenta". Nunca va a storage:
 * al recargar la página se pierde y A4/A5 regresan a A3.
 */
interface BorradorRegistro {
  datosBasicos?: RegistroFormValues
  credenciales?: CredencialesFormValues
  perfil?: PerfilProfesionalFormValues
}

let borrador: BorradorRegistro = {}

export function leerBorradorRegistro(): Readonly<BorradorRegistro> {
  return borrador
}

export function guardarPasoRegistro<K extends keyof BorradorRegistro>(paso: K, valores: BorradorRegistro[K]): void {
  borrador = { ...borrador, [paso]: valores }
}

export function limpiarBorradorRegistro(): void {
  borrador = {}
}

/**
 * Correo y contraseña recién usados (registro o login con correo sin verificar), para iniciar
 * sesión automáticamente al verificar el correo en A3A. Solo en memoria y se consumen una vez.
 */
let credencialesPendientes: { correo: string; contrasena: string } | null = null

export function recordarCredencialesPendientes(correo: string, contrasena: string): void {
  credencialesPendientes = { correo, contrasena }
}

export function tomarCredencialesPendientes(correo: string): { correo: string; contrasena: string } | null {
  const credenciales = credencialesPendientes
  credencialesPendientes = null
  return credenciales && credenciales.correo === correo ? credenciales : null
}
