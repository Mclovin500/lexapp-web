import { generatePath, Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { useAhora } from '@/hooks/useAhora'
import { formatearDiaCorto, formatearHora } from '@/lib/fechas'
import { agendaContent } from '../content/agenda.content'
import { salaDisponible } from '../lib/calendario'
import type { ReunionResumen } from '../types/agenda.types'
import { EtiquetaEstadoReunion } from './EtiquetaEstadoReunion'

interface ListaReunionesAgendaProps {
  reuniones: ReunionResumen[]
  vacio: string
  /** Muestra el día además de la hora (próximas e historial). */
  conDia?: boolean
  onConsultar: (id: string) => void
}

/** Reuniones con día, hora, cliente, expediente y estado. "Consultar" abre el detalle; "Unirse" → G1A. */
export function ListaReunionesAgenda({ reuniones, vacio, conDia = false, onConsultar }: ListaReunionesAgendaProps) {
  const { day } = agendaContent
  const ahora = useAhora()
  if (reuniones.length === 0) return <p className="text-body-md text-secondary py-2">{vacio}</p>

  return (
    <ul className="flex flex-col gap-2">
      {reuniones.map((r) => {
        const puedeUnirse = (r.estado === 'programada' || r.estado === 'en_curso') && salaDisponible(r.inicio, r.fin, ahora)
        return (
          <li key={r.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low">
            <div className="w-16 shrink-0 text-center">
              {conDia && <p className="text-[11px] uppercase text-secondary">{formatearDiaCorto(r.inicio)}</p>}
              <p className="text-label-lg text-on-surface font-semibold tabular-nums">{formatearHora(r.inicio)}</p>
              <p className="text-[11px] text-secondary tabular-nums">{formatearHora(r.fin)}</p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-label-lg text-on-surface font-semibold truncate">{r.titulo}</p>
              <p className="text-body-sm text-secondary truncate">
                {r.cliente.nombre} · {r.expediente?.folio ?? day.noCase}
              </p>
              <div className="mt-1">
                <EtiquetaEstadoReunion estado={r.estado} />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 shrink-0">
              {puedeUnirse && (
                <Link
                  to={generatePath(ROUTES.videoRoom, { reunionId: r.id })}
                  className="inline-flex h-9 px-3 items-center justify-center gap-1.5 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary-container hover:text-on-primary text-label-md font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Icon name="videocam" size={18} />
                  {day.join}
                </Link>
              )}
              <button
                type="button"
                onClick={() => onConsultar(r.id)}
                aria-label={`${day.view}: ${r.titulo}`}
                className="inline-flex h-9 px-3 items-center justify-center gap-1.5 rounded-lg bg-surface-container-lowest text-on-surface text-label-md font-semibold shadow-sm hover:bg-surface-container cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {day.view}
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
