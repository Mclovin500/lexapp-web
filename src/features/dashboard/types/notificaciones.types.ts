/** Tipos de la especificación (B1A) y del prompt de Stitch. */
export type TipoNotificacion =
  | 'nueva_solicitud'
  | 'nuevo_mensaje'
  | 'propuesta_aceptada'
  | 'propuesta_rechazada'
  | 'documento_recibido'
  | 'documento_pendiente'
  | 'nuevo_cobro'
  | 'pago_realizado'
  | 'actualizacion_expediente'
  | 'proxima_videollamada'

export type FiltroNotificaciones = 'todas' | 'no_leidas' | 'leidas'

/** Identificadores para abrir el módulo correcto (cada tipo usa el suyo). */
export interface DestinoNotificacion {
  solicitudId?: string
  propuestaId?: string
  expedienteId?: string
  movimientoId?: string
  reunionId?: string
  conversacionId?: string
}

export interface Notificacion {
  id: string
  tipo: TipoNotificacion
  /** Nombre o referencia del cliente (o del expediente). */
  referencia: string
  descripcion: string
  /** ISO 8601. */
  fecha: string
  leida: boolean
  destino: DestinoNotificacion
}

/** `GET /notificaciones?filtro=todas|no_leidas|leidas` */
export interface RespuestaNotificaciones {
  notificaciones: Notificacion[]
  totales: Record<FiltroNotificaciones, number>
}
