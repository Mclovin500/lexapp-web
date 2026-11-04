import { formatearFechaHora } from '@/lib/fechas'
import { estadosMovimiento } from '../content/estados-movimiento.content'
import { movimientoContent } from '../content/movimiento.content'
import type { CambioEstadoMovimiento } from '../types/pagos.types'
import { Icon } from '@/components/ui/Icon'

/** Línea de tiempo de cambios de estado (D5), del más reciente al más antiguo. */
export function HistorialMovimiento({ historial }: { historial: CambioEstadoMovimiento[] }) {
  const { history } = movimientoContent
  const ordenado = [...historial].sort((a, b) => b.fecha.localeCompare(a.fecha))

  if (ordenado.length === 0) return <p className="text-body-md text-secondary">{history.empty}</p>

  return (
    <ol className="flex flex-col">
      {ordenado.map((cambio, indice) => {
        const estado = estadosMovimiento[cambio.estado]
        return (
          <li key={`${cambio.estado}-${cambio.fecha}`} className="relative flex gap-4 pb-6 last:pb-0">
            {indice < ordenado.length - 1 && <span className="absolute left-4 top-9 bottom-0 w-px bg-surface-container-high" aria-hidden="true" />}
            <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${estado.clases}`} aria-hidden="true">
              <Icon name={estado.icon} size={16} />
            </span>
            <div className="min-w-0 pt-1">
              <p className="text-label-lg text-on-surface font-semibold">{estado.label}</p>
              <p className="text-body-sm text-secondary">
                <time dateTime={cambio.fecha}>{formatearFechaHora(cambio.fecha)}</time>
              </p>
              {cambio.nota && <p className="mt-1 text-body-md text-on-surface-variant">{cambio.nota}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
