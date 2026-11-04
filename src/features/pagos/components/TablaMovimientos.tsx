import { generatePath, Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { formatearFechaHora } from '@/lib/fechas'
import { formatearMonto } from '@/lib/moneda'
import { honorariosContent } from '../content/honorarios.content'
import type { MovimientoResumen } from '../types/pagos.types'
import { EtiquetaEstadoMovimiento } from './EtiquetaEstadoMovimiento'

/** Historial de cobros (D3): cliente, expediente, concepto, importe, fecha y estado. Movimiento → D5. */
export function TablaMovimientos({ movimientos }: { movimientos: MovimientoResumen[] }) {
  const { table } = honorariosContent

  return (
    <div className="overflow-x-auto rounded-xl bg-surface-container-lowest shadow-sm">
      <table className="w-full min-w-[920px] text-left">
        <caption className="sr-only">{table.caption}</caption>
        <thead>
          <tr className="text-label-sm uppercase tracking-wider text-secondary bg-surface-container-low/60">
            <th scope="col" className="px-4 py-3 font-semibold">{table.client}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{table.case}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{table.concept}</th>
            <th scope="col" className="px-4 py-3 font-semibold text-right">{table.amount}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{table.date}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{table.status}</th>
            <th scope="col" className="px-4 py-3 font-semibold text-right">{table.action}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container">
          {movimientos.map((m) => (
            <tr key={m.id} className="hover:bg-surface-container-low/50 transition-colors">
              <td className="px-4 py-4">
                <p className="text-label-lg text-on-surface font-semibold">{m.cliente.nombre}</p>
                <p className="text-body-sm text-secondary tabular-nums">{m.folio}</p>
              </td>
              <td className="px-4 py-4 text-body-md text-on-surface whitespace-nowrap">{m.expediente?.folio ?? table.noCase}</td>
              <td className="px-4 py-4 max-w-xs">
                <p className="text-body-md text-on-surface">{m.concepto}</p>
                <p className="text-body-sm text-secondary">{m.origen === 'propuesta' ? table.fromProposal : table.additional}</p>
              </td>
              <td className="px-4 py-4 text-right text-label-lg text-on-surface tabular-nums whitespace-nowrap">{formatearMonto(m.importe)}</td>
              <td className="px-4 py-4 text-body-sm text-secondary whitespace-nowrap">{formatearFechaHora(m.fecha)}</td>
              <td className="px-4 py-4">
                <EtiquetaEstadoMovimiento estado={m.estado} />
              </td>
              <td className="px-4 py-4 text-right">
                <Link
                  to={generatePath(ROUTES.paymentDetail, { movimientoId: m.id })}
                  aria-label={`${table.view}: ${m.concepto}, ${m.cliente.nombre}`}
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
