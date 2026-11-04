import { Icon } from '@/components/ui/Icon'
import { estadosPropuesta } from '../content/propuestas.content'
import type { EstadoPropuesta } from '../types/propuestas.types'

export function EtiquetaEstadoPropuesta({ estado }: { estado: EstadoPropuesta }) {
  const { label, icon, clases } = estadosPropuesta[estado]
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold whitespace-nowrap ${clases}`}>
      <Icon name={icon} size={14} />
      {label}
    </span>
  )
}
