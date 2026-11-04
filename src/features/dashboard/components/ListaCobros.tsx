import { generatePath, Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { formatearRelativa } from '@/lib/fechas'
import { formatearMonto } from '@/lib/moneda'
import { dashboardContent } from '../content/dashboard.content'
import type { CobroRelevante } from '../types/dashboard.types'

/** Pagos y cobros relevantes (el abogado solo consulta; el cliente paga desde su app, regla 9.1). */
export function ListaCobros({ cobros }: { cobros: CobroRelevante[] }) {
  const { payments } = dashboardContent

  if (cobros.length === 0) {
    return <p className="text-body-md text-secondary py-4">{payments.empty}</p>
  }

  return (
    <ul className="divide-y divide-surface-container">
      {cobros.map((cobro) => {
        const estado = payments.states[cobro.estado]
        return (
          <li key={cobro.id}>
            <Link
              to={generatePath(ROUTES.paymentDetail, { movimientoId: cobro.id })}
              aria-label={`${payments.detail}: ${cobro.concepto}, ${cobro.cliente}`}
              className="flex items-center justify-between gap-3 py-3 rounded-lg hover:bg-surface-container-low px-2 -mx-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <div className="min-w-0">
                <p className="text-label-md text-on-surface font-semibold truncate">{cobro.concepto}</p>
                <p className="text-body-sm text-secondary truncate">
                  {cobro.cliente} · {formatearRelativa(cobro.fecha)}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-label-lg text-on-surface font-semibold tabular-nums">{formatearMonto(cobro.monto)}</p>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${estado.clases}`}>
                  {estado.label}
                </span>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
