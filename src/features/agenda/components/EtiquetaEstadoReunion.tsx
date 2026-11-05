import { Icon } from '@/components/ui/Icon'
import { estadosReunion } from '../content/agenda.content'
import type { EstadoReunion } from '../types/agenda.types'

export function EtiquetaEstadoReunion({ estado }: { estado: EstadoReunion }) {
  const { label, icon, clases } = estadosReunion[estado]
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold whitespace-nowrap ${clases}`}>
      <Icon name={icon} size={14} />
      {label}
    </span>
  )
}
