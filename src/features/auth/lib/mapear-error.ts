import { isAxiosError } from 'axios'
import { ErrorAutenticacion, type TipoErrorAuth } from '../types/auth.types'

/**
 * `codigo`: endpoints que reciben un código de 6 dígitos (400/422 = código incorrecto).
 * `formulario`: endpoints que reciben datos de un formulario (400/422 = datos inválidos).
 */
export type ContextoError = 'codigo' | 'formulario'

/** Estados que una pantalla necesita interpretar distinto (p. ej. el login: 401 = credenciales). */
export type SobrescriturasError = Partial<Record<number, TipoErrorAuth>>

const POR_ESTADO: Record<number, TipoErrorAuth> = {
  401: 'sesion_expirada',
  409: 'conflicto',
  410: 'codigo_vencido',
  429: 'demasiados_intentos',
}

/** Lee el `mensaje` que el backend devuelve en `{ mensaje }` o en `ApiResponse`. */
export function mensajeDelServidor(error: unknown): string | undefined {
  if (!isAxiosError(error)) return undefined
  const datos: unknown = error.response?.data
  if (typeof datos === 'object' && datos !== null && 'mensaje' in datos) {
    const mensaje = (datos as { mensaje: unknown }).mensaje
    if (typeof mensaje === 'string' && mensaje.length > 0) return mensaje
  }
  return undefined
}

/**
 * Los códigos de 6 dígitos del backend responden con texto ("Código inválido.",
 * "El código ha expirado…", "Demasiados intentos…"). Se distinguen por su contenido.
 */
export function tipoPorMensajeCodigo(mensaje: string | undefined): TipoErrorAuth {
  const texto = mensaje?.toLowerCase() ?? ''
  if (texto.includes('demasiados')) return 'demasiados_intentos'
  if (texto.includes('expirado')) return 'codigo_vencido'
  return 'codigo_incorrecto'
}

/** Traduce cualquier error de una petición a un `ErrorAutenticacion` con su tipo. */
export function mapearErrorApi(
  error: unknown,
  contexto: ContextoError,
  sobrescrituras: SobrescriturasError = {},
): ErrorAutenticacion {
  if (error instanceof ErrorAutenticacion) return error

  if (!isAxiosError(error)) return new ErrorAutenticacion('desconocido')
  if (!error.response) return new ErrorAutenticacion('red')

  const status = error.response.status
  const servidor = mensajeDelServidor(error)
  const sobrescrito = sobrescrituras[status]
  if (sobrescrito) return new ErrorAutenticacion(sobrescrito, undefined, servidor)

  if (status === 400 || status === 422) {
    const tipo = contexto === 'codigo' ? tipoPorMensajeCodigo(servidor) : 'datos_invalidos'
    return new ErrorAutenticacion(tipo, undefined, servidor)
  }

  return new ErrorAutenticacion(POR_ESTADO[status] ?? 'desconocido', undefined, servidor)
}

/** Elige el mensaje de un mapa por tipo de error, con respaldo en `desconocido`. */
export function mensajePorTipo<T extends { desconocido: string }>(
  tipo: TipoErrorAuth,
  mensajes: T & Partial<Record<TipoErrorAuth, string>>,
): string {
  return mensajes[tipo] ?? mensajes.desconocido
}
