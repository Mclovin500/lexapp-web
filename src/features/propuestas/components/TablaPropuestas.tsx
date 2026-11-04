import { formatearFechaCorta, formatearFechaHora, hoyIso } from '@/lib/fechas'
import { formatearMonto } from '@/lib/moneda'
import { propuestasContent } from '../content/propuestas.content'
import type { PropuestaResumen } from '../types/propuestas.types'
import { AccionesPropuesta } from './AccionesPropuesta'
import { EtiquetaEstadoPropuesta } from './EtiquetaEstadoPropuesta'

interface TablaPropuestasProps {
  propuestas: PropuestaResumen[]
  onVer: (id: string) => void
  onCancelar: (propuesta: PropuestaResumen) => void
}

/** D2: número, cliente, servicio, importe, fechas y estado, con acciones por estado. */
export function TablaPropuestas({ propuestas, onVer, onCancelar }: TablaPropuestasProps) {
  const { table } = propuestasContent
  const hoy = hoyIso()

  return (
    <div className="overflow-x-auto rounded-xl bg-surface-container-lowest shadow-sm">
      <table className="w-full min-w-[1040px] text-left">
        <caption className="sr-only">{table.caption}</caption>
        <thead>
          <tr className="text-label-sm uppercase tracking-wider text-secondary bg-surface-container-low/60">
            <th scope="col" className="px-4 py-3 font-semibold">{table.number}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{table.client}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{table.service}</th>
            <th scope="col" className="px-4 py-3 font-semibold text-right">{table.amount}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{table.created}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{table.validUntil}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{table.status}</th>
            <th scope="col" className="px-4 py-3 font-semibold text-right">{table.actions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container">
          {propuestas.map((propuesta) => {
            const vencida =
              propuesta.fechaVigencia < hoy && (propuesta.estado === 'enviada' || propuesta.estado === 'pendiente_respuesta')
            return (
              <tr key={propuesta.id} className="hover:bg-surface-container-low/50 transition-colors">
                <td className="px-4 py-4 text-label-md text-on-surface tabular-nums whitespace-nowrap">{propuesta.folio}</td>
                <td className="px-4 py-4">
                  <p className="text-label-lg text-on-surface font-semibold">{propuesta.cliente.nombre}</p>
                  {propuesta.cliente.organizacion && <p className="text-body-sm text-secondary">{propuesta.cliente.organizacion}</p>}
                </td>
                <td className="px-4 py-4 max-w-xs text-body-md text-on-surface">{propuesta.servicio}</td>
                <td className="px-4 py-4 text-right text-label-lg text-on-surface tabular-nums whitespace-nowrap">{formatearMonto(propuesta.importe)}</td>
                <td className="px-4 py-4 text-body-sm text-secondary whitespace-nowrap">{formatearFechaHora(propuesta.fechaCreacion)}</td>
                <td className="px-4 py-4 text-body-sm whitespace-nowrap">
                  <span className={vencida ? 'text-error font-semibold' : 'text-secondary'}>{formatearFechaCorta(propuesta.fechaVigencia)}</span>
                  {vencida && <span className="block text-[11px] text-error">{table.expired}</span>}
                </td>
                <td className="px-4 py-4">
                  <EtiquetaEstadoPropuesta estado={propuesta.estado} />
                </td>
                <td className="px-4 py-4">
                  <AccionesPropuesta propuesta={propuesta} onVer={() => onVer(propuesta.id)} onCancelar={() => onCancelar(propuesta)} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
