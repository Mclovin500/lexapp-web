import { Icon } from '@/components/ui/Icon'
import { formatearFechaHora } from '@/lib/fechas'
import { detalleExpedienteContent } from '../content/detalle-expediente.content'
import type { EventoExpediente, TipoEventoExpediente } from '../types/expedientes.types'

const iconos: Record<TipoEventoExpediente, string> = {
  apertura: 'folder_open',
  estado: 'swap_horiz',
  documento: 'description',
  pago: 'payments',
  reunion: 'videocam',
}

/** Línea de tiempo del expediente, del evento más reciente al más antiguo. */
export function HistorialExpediente({ eventos }: { eventos: EventoExpediente[] }) {
  const { history } = detalleExpedienteContent
  if (eventos.length === 0) return <p className="text-body-md text-secondary">{history.empty}</p>

  return (
    <ol className="flex flex-col">
      {eventos.map((evento, indice) => (
        <li key={evento.id} className="relative flex gap-4 pb-5 last:pb-0">
          {indice < eventos.length - 1 && <span className="absolute left-4 top-9 bottom-0 w-px bg-surface-container-high" aria-hidden="true" />}
          <span className="shrink-0 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary" aria-hidden="true">
            <Icon name={iconos[evento.tipo]} size={16} />
          </span>
          <div className="min-w-0 pt-1">
            <p className="text-body-md text-on-surface">{evento.descripcion}</p>
            <p className="text-body-sm text-secondary">
              {evento.autor} · <time dateTime={evento.fecha}>{formatearFechaHora(evento.fecha)}</time>
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}
