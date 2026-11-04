import { Icon } from '@/components/ui/Icon'
import { estadosSolicitud } from '../content/solicitudes.content'
import type { EstadoSolicitud } from '../types/solicitudes.types'

export function EtiquetaEstadoSolicitud({ estado }: { estado: EstadoSolicitud }) {
  const { label, icon, clases } = estadosSolicitud[estado]
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold whitespace-nowrap ${clases}`}>
      <Icon name={icon} size={14} />
      {label}
    </span>
  )
}
