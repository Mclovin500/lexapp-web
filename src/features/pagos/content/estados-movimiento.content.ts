import type { EstadoMovimiento } from '../types/pagos.types'

/** Etiquetas de D5 (especificación) usadas en D3, D5 y el Dashboard. */
export const estadosMovimiento: Record<EstadoMovimiento, { label: string; corto: string; icon: string; clases: string }> = {
  pendiente: { label: 'Pendiente de pago', corto: 'Pendiente', icon: 'schedule', clases: 'bg-tertiary/10 text-tertiary' },
  pagado: { label: 'Pagado por el cliente', corto: 'Pagado', icon: 'check_circle', clases: 'bg-primary-container/15 text-primary' },
  en_proceso: { label: 'En procesamiento', corto: 'En proceso', icon: 'sync', clases: 'bg-secondary-container text-on-secondary-container' },
  rechazado: { label: 'Rechazado', corto: 'Rechazado', icon: 'cancel', clases: 'bg-error/10 text-error' },
  retenido: { label: 'Fondos retenidos', corto: 'Retenido', icon: 'lock_clock', clases: 'bg-surface-container-highest text-on-surface' },
  liberado: { label: 'Fondos liberados', corto: 'Liberado', icon: 'lock_open', clases: 'bg-primary/10 text-primary' },
}
