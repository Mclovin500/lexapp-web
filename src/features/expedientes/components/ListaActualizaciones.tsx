import { Icon } from '@/components/ui/Icon'
import { formatearFechaHora } from '@/lib/fechas'
import { detalleExpedienteContent } from '../content/detalle-expediente.content'
import type { ActualizacionExpediente } from '../types/expedientes.types'

export function ListaActualizaciones({ actualizaciones }: { actualizaciones: ActualizacionExpediente[] }) {
  const { updates } = detalleExpedienteContent
  if (actualizaciones.length === 0) return <p className="text-body-md text-secondary">{updates.empty}</p>

  return (
    <ul className="flex flex-col gap-3">
      {actualizaciones.map((a) => (
        <li key={a.id} className="p-4 rounded-lg bg-surface-container-low">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="text-label-lg text-on-surface font-semibold">{a.titulo}</p>
            <span
              className={`inline-flex items-center gap-1 text-label-sm ${a.visibleCliente ? 'text-primary' : 'text-secondary'}`}
            >
              <Icon name={a.visibleCliente ? 'visibility' : 'visibility_off'} size={14} />
              {a.visibleCliente ? updates.visible : updates.internal}
            </span>
          </div>
          <p className="mt-1 text-body-md text-on-surface-variant whitespace-pre-line">{a.descripcion}</p>
          <p className="mt-2 text-body-sm text-secondary">
            {a.autor} · <time dateTime={a.fecha}>{formatearFechaHora(a.fecha)}</time>
          </p>
        </li>
      ))}
    </ul>
  )
}
