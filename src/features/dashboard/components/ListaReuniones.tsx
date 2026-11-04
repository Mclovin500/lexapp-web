import { generatePath, Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { formatearDiaCorto, formatearHora } from '@/lib/fechas'
import { dashboardContent } from '../content/dashboard.content'
import type { ReunionProxima } from '../types/dashboard.types'

/** Próximas reuniones: todas virtuales (regla 9.2), con acceso a la sala (G1A). */
export function ListaReuniones({ reuniones }: { reuniones: ReunionProxima[] }) {
  const { meetings } = dashboardContent

  if (reuniones.length === 0) {
    return <p className="text-body-md text-secondary py-4">{meetings.empty}</p>
  }

  return (
    <ul className="space-y-3">
      {reuniones.map((reunion) => (
        <li key={reunion.id} className="flex items-center gap-4 p-3 rounded-lg bg-surface-container-low">
          <div className="w-20 shrink-0 text-center">
            <p className="text-[11px] uppercase text-secondary">{formatearDiaCorto(reunion.inicio)}</p>
            <p className="text-label-lg text-on-surface font-semibold tabular-nums">{formatearHora(reunion.inicio)}</p>
            <p className="text-[11px] text-secondary tabular-nums">{formatearHora(reunion.fin)}</p>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-label-lg text-on-surface font-semibold truncate">{reunion.titulo}</p>
            <p className="text-body-sm text-secondary truncate">
              {reunion.cliente} · {reunion.expediente ?? meetings.noCase}
            </p>
          </div>
          <Link
            to={generatePath(ROUTES.videoRoom, { reunionId: reunion.id })}
            className="inline-flex h-9 px-3 items-center gap-1.5 rounded-lg bg-surface-container-lowest text-primary text-label-md font-semibold shadow-sm hover:bg-surface-container transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Icon name="videocam" size={18} />
            <span className="hidden sm:inline">{meetings.join}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
