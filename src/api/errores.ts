import { isAxiosError } from 'axios'

/**
 * Errores de las pantallas internas (B1 en adelante).
 * Las pantallas de acceso usan `ErrorAutenticacion` (features/auth); este tipo
 * es el equivalente genérico para el resto de los módulos.
 */
export type TipoErrorApi =
  | 'sesion_expirada'
  | 'sin_permiso'
  | 'no_encontrado'
  | 'conflicto'
  | 'datos_invalidos'
  | 'demasiados_intentos'
  | 'red'
  | 'desconocido'

export class ErrorApi extends Error {
  readonly tipo: TipoErrorApi

  constructor(tipo: TipoErrorApi, mensaje?: string) {
    super(mensaje ?? tipo)
    this.name = 'ErrorApi'
    this.tipo = tipo
  }
}

const POR_ESTADO: Record<number, TipoErrorApi> = {
  400: 'datos_invalidos',
  401: 'sesion_expirada',
  403: 'sin_permiso',
  404: 'no_encontrado',
  409: 'conflicto',
  422: 'datos_invalidos',
  429: 'demasiados_intentos',
}

/** Traduce cualquier error de una petición a un `ErrorApi`. */
export function aErrorApi(error: unknown): ErrorApi {
  if (error instanceof ErrorApi) return error
  if (!isAxiosError(error)) return new ErrorApi('desconocido')
  if (!error.response) return new ErrorApi('red')
  return new ErrorApi(POR_ESTADO[error.response.status] ?? 'desconocido')
}

/** Mensajes genéricos por tipo; cada pantalla puede sobrescribirlos. */
export const MENSAJES_ERROR_API: Record<TipoErrorApi, string> = {
  sesion_expirada: 'Tu sesión venció. Inicia sesión de nuevo.',
  sin_permiso: 'No tienes permiso para ver esta información.',
  no_encontrado: 'No encontramos la información solicitada.',
  conflicto: 'La información cambió mientras la consultabas. Actualiza e inténtalo de nuevo.',
  datos_invalidos: 'Revisa los datos ingresados e inténtalo de nuevo.',
  demasiados_intentos: 'Demasiados intentos. Inténtalo más tarde.',
  red: 'No pudimos conectar con el servidor.',
  desconocido: 'Ocurrió un error inesperado.',
}
