import { generatePath, Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Avatar } from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'
import { formatearFechaHora, formatearRelativa } from '@/lib/fechas'
import { solicitudesContent, tiposPersona } from '../content/solicitudes.content'
import type { SolicitudResumen } from '../types/solicitudes.types'
import { EtiquetaEstadoSolicitud } from './EtiquetaEstadoSolicitud'
import { EtiquetaPrioridad } from './EtiquetaPrioridad'

/** Lista de C1: cliente, necesidad o asunto, fecha, estado, prioridad y acción para ver (C1 → C2). */
export function TablaSolicitudes({ solicitudes }: { solicitudes: SolicitudResumen[] }) {
  const { table } = solicitudesContent

  return (
    <div className="overflow-x-auto rounded-xl bg-surface-container-lowest shadow-sm">
      <table className="w-full min-w-[880px] text-left">
        <caption className="sr-only">{table.caption}</caption>
        <thead>
          <tr className="text-label-sm uppercase tracking-wider text-secondary bg-surface-container-low/60">
            <th scope="col" className="px-5 py-3 font-semibold">{table.client}</th>
            <th scope="col" className="px-5 py-3 font-semibold">{table.matter}</th>
            <th scope="col" className="px-5 py-3 font-semibold">{table.date}</th>
            <th scope="col" className="px-5 py-3 font-semibold">{table.status}</th>
            <th scope="col" className="px-5 py-3 font-semibold">{table.priority}</th>
            <th scope="col" className="px-5 py-3 font-semibold text-right">{table.action}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container">
          {solicitudes.map((solicitud) => (
            <tr key={solicitud.id} className="hover:bg-surface-container-low/50 transition-colors">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <Avatar nombre={solicitud.cliente.nombre} size="sm" />
                  <div className="min-w-0">
                    <p className="text-label-lg text-on-surface font-semibold">{solicitud.cliente.nombre}</p>
                    <p className="text-body-sm text-secondary">
                      {solicitud.cliente.organizacion ?? tiposPersona[solicitud.cliente.tipoPersona]}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 max-w-sm">
                <p className="text-body-md text-on-surface line-clamp-2">{solicitud.asunto}</p>
                <p className="text-body-sm text-secondary">{solicitud.areaJuridica}</p>
              </td>
              <td className="px-5 py-4 whitespace-nowrap">
                <p className="text-body-md text-on-surface">{formatearRelativa(solicitud.fechaRecepcion)}</p>
                <p className="text-body-sm text-secondary">{formatearFechaHora(solicitud.fechaRecepcion)}</p>
              </td>
              <td className="px-5 py-4">
                <EtiquetaEstadoSolicitud estado={solicitud.estado} />
              </td>
              <td className="px-5 py-4">
                {solicitud.prioridad ? (
                  <EtiquetaPrioridad prioridad={solicitud.prioridad} />
                ) : (
                  <span className="text-secondary" aria-label="Sin prioridad">{table.noPriority}</span>
                )}
              </td>
              <td className="px-5 py-4 text-right">
                <Link
                  to={generatePath(ROUTES.requestDetail, { solicitudId: solicitud.id })}
                  aria-label={`${table.view}: ${solicitud.cliente.nombre}`}
                  className="inline-flex h-9 px-3 items-center gap-1.5 rounded-lg bg-surface-container text-on-surface text-label-md font-semibold hover:bg-surface-container-high transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Icon name="visibility" size={18} />
                  {table.view}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
