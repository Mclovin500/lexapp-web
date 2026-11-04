import { generatePath, Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Avatar } from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'
import { formatearRelativa } from '@/lib/fechas'
import { EtiquetaPrioridad } from '@/features/solicitudes/components/EtiquetaPrioridad'
import type { SolicitudResumen } from '@/features/solicitudes/types/solicitudes.types'
import { dashboardContent } from '../content/dashboard.content'

export function ListaSolicitudesNuevas({ solicitudes }: { solicitudes: SolicitudResumen[] }) {
  const { requests } = dashboardContent

  if (solicitudes.length === 0) {
    return <p className="text-body-md text-secondary py-4">{requests.empty}</p>
  }

  return (
    <ul className="divide-y divide-surface-container">
      {solicitudes.map((solicitud) => (
        <li key={solicitud.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Avatar nombre={solicitud.cliente.nombre} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-label-lg text-on-surface font-semibold">{solicitud.cliente.nombre}</p>
                <EtiquetaPrioridad prioridad={solicitud.prioridad} />
              </div>
              {solicitud.cliente.organizacion && (
                <p className="text-body-sm text-secondary">{solicitud.cliente.organizacion}</p>
              )}
              <p className="mt-1 text-body-md text-on-surface-variant">{solicitud.asunto}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-body-sm text-secondary">
                <span className="inline-flex items-center gap-1">
                  <Icon name="gavel" size={14} />
                  {solicitud.areaJuridica}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Icon name="schedule" size={14} />
                  {formatearRelativa(solicitud.fechaRecepcion)}
                </span>
              </p>
            </div>
          </div>
          <Link
            to={generatePath(ROUTES.requestDetail, { solicitudId: solicitud.id })}
            className="inline-flex h-10 px-4 items-center justify-center gap-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-label-md font-semibold shadow-sm transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Icon name="visibility" size={18} />
            {requests.review}
          </Link>
        </li>
      ))}
    </ul>
  )
}
