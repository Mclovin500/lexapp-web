import { generatePath, Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Avatar } from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'
import { formatearRelativa } from '@/lib/fechas'
import { tiposPersona } from '@/features/solicitudes/content/solicitudes.content'
import { clientesContent } from '../content/clientes.content'
import type { ClienteResumen } from '../types/clientes.types'
import { EtiquetaEstadoCliente } from './EtiquetaEstadoCliente'

/** F1: nombre, correo, teléfono, número de expedientes, última actividad y estado. Ver → F2. */
export function TablaClientes({ clientes }: { clientes: ClienteResumen[] }) {
  const { table } = clientesContent

  return (
    <div className="overflow-x-auto rounded-xl bg-surface-container-lowest shadow-sm">
      <table className="w-full min-w-[1040px] text-left">
        <caption className="sr-only">{table.caption}</caption>
        <thead>
          <tr className="text-label-sm uppercase tracking-wider text-secondary bg-surface-container-low/60">
            <th scope="col" className="px-4 py-3 font-semibold">{table.name}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{table.email}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{table.phone}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{table.cases}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{table.activity}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{table.status}</th>
            <th scope="col" className="px-4 py-3 font-semibold text-right">{table.action}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container">
          {clientes.map((c) => (
            <tr key={c.id} className="hover:bg-surface-container-low/50 transition-colors">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Avatar nombre={c.nombre} size="sm" />
                  <div className="min-w-0">
                    <p className="text-label-lg text-on-surface font-semibold">{c.nombre}</p>
                    <p className="text-body-sm text-secondary">{c.organizacion ?? tiposPersona[c.tipoPersona]}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-body-md">
                <a href={`mailto:${c.correo}`} className="text-primary hover:underline break-all">
                  {c.correo}
                </a>
              </td>
              <td className="px-4 py-4 text-body-md whitespace-nowrap tabular-nums">
                {c.telefono ?? <span className="text-outline">{table.noPhone}</span>}
              </td>
              <td className="px-4 py-4 text-body-sm text-on-surface-variant whitespace-nowrap">{table.casesCount(c.expedientes.total, c.expedientes.abiertos)}</td>
              <td className="px-4 py-4 text-body-sm text-secondary whitespace-nowrap">
                <time dateTime={c.ultimaActividad}>{formatearRelativa(c.ultimaActividad)}</time>
              </td>
              <td className="px-4 py-4">
                <EtiquetaEstadoCliente estado={c.estado} />
              </td>
              <td className="px-4 py-4 text-right">
                <Link
                  to={generatePath(ROUTES.clientDetail, { clienteId: c.id })}
                  aria-label={`${table.view}: ${c.nombre}`}
                  className="inline-flex h-9 px-3 items-center gap-1.5 rounded-lg bg-surface-container text-on-surface text-label-md font-semibold hover:bg-surface-container-high transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
