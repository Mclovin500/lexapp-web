import { generatePath, Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { formatearRelativa } from '@/lib/fechas'
import { formatearMonto } from '@/lib/moneda'
import { EtiquetaEstadoMovimiento } from '@/features/pagos/components/EtiquetaEstadoMovimiento'
import type { MovimientoResumen } from '@/features/pagos/types/pagos.types'
import { dashboardContent } from '../content/dashboard.content'

/** Pagos y cobros relevantes (el abogado solo consulta; el cliente paga desde su app, regla 9.1). */
export function ListaCobros({ cobros }: { cobros: MovimientoResumen[] }) {
  const { payments } = dashboardContent

  if (cobros.length === 0) {
    return <p className="text-body-md text-secondary py-4">{payments.empty}</p>
  }

  return (
    <ul className="divide-y divide-surface-container">
      {cobros.map((cobro) => (
        <li key={cobro.id}>
          <Link
            to={generatePath(ROUTES.paymentDetail, { movimientoId: cobro.id })}
            aria-label={`${payments.detail}: ${cobro.concepto}, ${cobro.cliente.nombre}`}
            className="flex items-center justify-between gap-3 py-3 rounded-lg hover:bg-surface-container-low px-2 -mx-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <div className="min-w-0">
              <p className="text-label-md text-on-surface font-semibold truncate">{cobro.concepto}</p>
              <p className="text-body-sm text-secondary truncate">
                {cobro.cliente.nombre} · {formatearRelativa(cobro.fecha)}
              </p>
            </div>
            <div className="text-right shrink-0 flex flex-col items-end gap-1">
              <p className="text-label-lg text-on-surface font-semibold tabular-nums">{formatearMonto(cobro.importe)}</p>
              <EtiquetaEstadoMovimiento estado={cobro.estado} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
