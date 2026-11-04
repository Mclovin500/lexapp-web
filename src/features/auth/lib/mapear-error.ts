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
  const sobrescrito = sobrescrituras[status]
  if (sobrescrito) return new ErrorAutenticacion(sobrescrito)

  if (status === 400 || status === 422) {
    return new ErrorAutenticacion(contexto === 'codigo' ? 'codigo_incorrecto' : 'datos_invalidos')
  }

  return new ErrorAutenticacion(POR_ESTADO[status] ?? 'desconocido')
}

/** Elige el mensaje de un mapa por tipo de error, con respaldo en `desconocido`. */
export function mensajePorTipo<T extends { desconocido: string }>(
  tipo: TipoErrorAuth,
  mensajes: T & Partial<Record<TipoErrorAuth, string>>,
): string {
  return mensajes[tipo] ?? mensajes.desconocido
}
