import type { DestinoCarga } from '../types/estado-navegacion.types'

export const bienvenidaContent = {
  brand: {
    prefix: 'Lex',
    highlight: 'App',
  },
  slogan: 'Tu Abogado al Alcance de un Clic',
  loadingLabel: 'Iniciando entorno seguro...',
  /** Texto de carga según a dónde continúa A1. */
  loadingLabelPorDestino: {
    '/dashboard': 'Iniciando entorno seguro...',
    '/validacion-profesional': 'Iniciando entorno seguro...',
    '/registro': 'Preparando tu registro...',
  } satisfies Record<DestinoCarga, string>,
  /** Tiempo mínimo en pantalla para que la carga no parpadee (ms). */
  minimumDisplayMs: 1200,
}
