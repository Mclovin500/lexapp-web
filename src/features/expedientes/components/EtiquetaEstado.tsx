import { Icon } from '@/components/ui/Icon'
import { estadosDocumento, estadosExpediente } from '../content/estados-expediente.content'
import type { EstadoDocumento } from '../types/documentos.types'
import type { EstadoExpediente } from '../types/expedientes.types'

function Etiqueta({ label, icon, clases }: { label: string; icon: string; clases: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold whitespace-nowrap ${clases}`}>
      <Icon name={icon} size={14} />
      {label}
    </span>
  )
}

export function EtiquetaEstadoExpediente({ estado }: { estado: EstadoExpediente }) {
  return <Etiqueta {...estadosExpediente[estado]} />
}

export function EtiquetaEstadoDocumento({ estado }: { estado: EstadoDocumento }) {
  return <Etiqueta {...estadosDocumento[estado]} />
}
