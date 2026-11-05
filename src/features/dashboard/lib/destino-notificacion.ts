import { generatePath } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import type { Notificacion } from '../types/notificaciones.types'

/**
 * Navegación de B1A según la especificación:
 * Solicitud → C1/C2 · Mensaje → H1 · Propuesta → D2 · Documento → E3 ·
 * Cobro y pago → D5 · Expediente → E2 · Videollamada → G1A.
 * Si falta el identificador, se abre el listado del módulo.
 */
export function rutaDeNotificacion({ tipo, destino }: Notificacion): string {
  switch (tipo) {
    case 'nueva_solicitud':
      return destino.solicitudId
        ? generatePath(ROUTES.requestDetail, { solicitudId: destino.solicitudId })
        : ROUTES.requests
    case 'nuevo_mensaje':
      return destino.conversacionId
        ? `${ROUTES.chat}?${new URLSearchParams({ conversacion: destino.conversacionId }).toString()}`
        : ROUTES.chat
    case 'propuesta_aceptada':
    case 'propuesta_rechazada':
      return ROUTES.proposals
    case 'documento_recibido':
    case 'documento_pendiente':
      return destino.expedienteId
        ? generatePath(ROUTES.caseDocuments, { expedienteId: destino.expedienteId })
        : ROUTES.cases
    case 'nuevo_cobro':
    case 'pago_realizado':
      return destino.movimientoId
        ? generatePath(ROUTES.paymentDetail, { movimientoId: destino.movimientoId })
        : ROUTES.fees
    case 'actualizacion_expediente':
      return destino.expedienteId
        ? generatePath(ROUTES.caseDetail, { expedienteId: destino.expedienteId })
        : ROUTES.cases
    case 'proxima_videollamada':
      return destino.reunionId
        ? generatePath(ROUTES.videoRoom, { reunionId: destino.reunionId })
        : ROUTES.agenda
  }
}
