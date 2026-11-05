// PROVISIONAL: el proveedor de video (WebRTC: LiveKit, Daily, Twilio…) está por definir con el backend.
import { ErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import type { AccesoSala } from '../types/agenda.types'

/** Estados de G1A que dependen de la conexión (los demás los maneja la pantalla). */
export type EstadoConexion = 'esperando_cliente' | 'conectando' | 'activa' | 'interrumpida'

export interface ConexionVideollamada {
  desconectar: () => void
  /** Solo en datos de prueba: simula que se cae la red. */
  simularCorte?: () => void
}

/**
 * Conecta con la sala usando la credencial de `POST /reuniones/{id}/sala`.
 * TODO: implementar con el SDK del proveedor elegido (video del cliente, eventos de conexión).
 */
export async function conectarVideollamada(acceso: AccesoSala, onEstado: (estado: EstadoConexion) => void): Promise<ConexionVideollamada> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { conectarVideollamadaMock } = await import('./videollamada.mock')
    return conectarVideollamadaMock(acceso, onEstado)
  }
  throw new ErrorApi('desconocido')
}
