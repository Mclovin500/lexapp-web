import { Icon } from '@/components/ui/Icon'
import { estadosMovimiento } from '../content/estados-movimiento.content'
import type { EstadoMovimiento } from '../types/pagos.types'

export function EtiquetaEstadoMovimiento({ estado, largo = false }: { estado: EstadoMovimiento; largo?: boolean }) {
  const { label, corto, icon, clases } = estadosMovimiento[estado]
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold whitespace-nowrap ${clases}`}>
      <Icon name={icon} size={14} />
      {largo ? label : corto}
    </span>
  )
}
