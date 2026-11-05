import { Icon } from '@/components/ui/Icon'
import { estadosCliente } from '../content/clientes.content'
import type { EstadoCliente } from '../types/clientes.types'

export function EtiquetaEstadoCliente({ estado }: { estado: EstadoCliente }) {
  const { label, icon, clases } = estadosCliente[estado]
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold whitespace-nowrap ${clases}`}>
      <Icon name={icon} size={14} />
      {label}
    </span>
  )
}
