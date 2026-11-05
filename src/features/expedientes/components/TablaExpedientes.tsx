import { generatePath, Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Avatar } from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'
import { formatearFechaCorta, formatearRelativa } from '@/lib/fechas'
import { expedientesContent } from '../content/expedientes.content'
import type { ExpedienteResumen } from '../types/expedientes.types'
import { EtiquetaEstadoExpediente } from './EtiquetaEstado'

/** E1: identificador, cliente, asunto, área, estado, fecha y última actualización. Ver → E2. */
export function TablaExpedientes({ expedientes }: { expedientes: ExpedienteResumen[] }) {
  const { table } = expedientesContent

  return (
    <div className="overflow-x-auto rounded-xl bg-surface-container-lowest shadow-sm">
      <table className="w-full min-w-[1040px] text-left">
        <caption className="sr-only">{table.caption}</caption>
        <thead>
          <tr className="text-label-sm uppercase tracking-wider text-secondary bg-surface-container-low/60">
            <th scope="col" className="px-4 py-3 font-semibold">{table.id}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{table.client}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{table.subject}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{table.area}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{table.status}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{table.date}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{table.updated}</th>
            <th scope="col" className="px-4 py-3 font-semibold text-right">{table.action}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container">
          {expedientes.map((e) => (
            <tr key={e.id} className="hover:bg-surface-container-low/50 transition-colors">
              <td className="px-4 py-4 text-label-md text-on-surface font-semibold tabular-nums whitespace-nowrap">{e.folio}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Avatar nombre={e.cliente.nombre} size="sm" />
                  <div className="min-w-0">
                    <p className="text-label-lg text-on-surface font-semibold">{e.cliente.nombre}</p>
                    {e.cliente.organizacion && <p className="text-body-sm text-secondary">{e.cliente.organizacion}</p>}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 max-w-xs text-body-md text-on-surface">{e.asunto}</td>
              <td className="px-4 py-4 text-body-sm text-on-surface-variant">{e.areaJuridica}</td>
              <td className="px-4 py-4">
                <EtiquetaEstadoExpediente estado={e.estado} />
              </td>
              <td className="px-4 py-4 text-body-sm text-secondary whitespace-nowrap">{formatearFechaCorta(e.fechaApertura)}</td>
              <td className="px-4 py-4 text-body-sm text-secondary whitespace-nowrap">
                <time dateTime={e.ultimaActualizacion}>{formatearRelativa(e.ultimaActualizacion)}</time>
              </td>
              <td className="px-4 py-4 text-right">
                <Link
                  to={generatePath(ROUTES.caseDetail, { expedienteId: e.id })}
                  aria-label={`${table.view} ${e.folio}`}
                  className="inline-flex h-9 px-3 items-center gap-1.5 rounded-lg bg-surface-container text-on-surface text-label-md font-semibold hover:bg-surface-container-high transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {table.view}
                  <Icon name="arrow_forward" size={18} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
