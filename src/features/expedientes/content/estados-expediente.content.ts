import type { EstadoDocumento } from '../types/documentos.types'
import type { EstadoExpediente } from '../types/expedientes.types'

interface Estilo {
  label: string
  descripcion: string
  icon: string
  clases: string
}

/** Sección 8: distinguen al menos los casos activos de los finalizados. */
export const estadosExpediente: Record<EstadoExpediente, Estilo> = {
  activo: { label: 'Activo', descripcion: 'El caso está en curso.', icon: 'play_circle', clases: 'bg-primary-container/15 text-primary' },
  en_espera: {
    label: 'En espera',
    descripcion: 'Sigue abierto, pero depende del cliente o de una autoridad.',
    icon: 'pause_circle',
    clases: 'bg-tertiary/10 text-tertiary',
  },
  finalizado: {
    label: 'Finalizado',
    descripcion: 'El caso concluyó. Solo se puede consultar o reabrir.',
    icon: 'task_alt',
    clases: 'bg-surface-container-highest text-on-surface-variant',
  },
}

export const estadosDocumento: Record<EstadoDocumento, Omit<Estilo, 'descripcion'>> = {
  pendiente_revision: { label: 'Pendiente de revisión', icon: 'pending', clases: 'bg-tertiary/10 text-tertiary' },
  revisado: { label: 'Revisado', icon: 'check_circle', clases: 'bg-primary-container/15 text-primary' },
  requiere_correccion: { label: 'Requiere corrección', icon: 'error', clases: 'bg-error/10 text-error' },
}
