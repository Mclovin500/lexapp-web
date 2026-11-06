import { Icon } from '@/components/ui/Icon'
import { agendaContent, DIAS_CORTOS_LUNES } from '../content/agenda.content'
import { aFechaLocal, diasDeCuadricula, nombreMes, sumarMeses } from '../lib/calendario'
import type { ReunionResumen } from '../types/agenda.types'

interface CalendarioMensualProps {
  mes: Date
  seleccionado: string
  reuniones: ReunionResumen[]
  cargando: boolean
  onSeleccionar: (fecha: string) => void
}

const boton =
  'w-9 h-9 inline-flex items-center justify-center rounded-lg text-secondary hover:bg-surface-container cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

/** "Calendario" de G1: vista mensual; cada día muestra cuántas reuniones tiene. */
export function CalendarioMensual({ mes, seleccionado, reuniones, cargando, onSeleccionar }: CalendarioMensualProps) {
  const { calendar } = agendaContent
  const hoy = aFechaLocal(new Date())
  const porDia = new Map<string, number>()
  for (const r of reuniones) {
    if (r.estado === 'cancelada') continue
    const dia = aFechaLocal(new Date(r.inicio))
    porDia.set(dia, (porDia.get(dia) ?? 0) + 1)
  }

  return (
    <section aria-label={calendar.ariaLabel} className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-headline-sm text-on-surface capitalize" aria-live="polite">
          {nombreMes(mes)}
        </h2>
        <div className="flex items-center gap-1">
          <button type="button" className={boton} aria-label={calendar.previous} onClick={() => onSeleccionar(aFechaLocal(sumarMeses(mes, -1)))}>
            <Icon name="chevron_left" size={20} />
          </button>
          <button
            type="button"
            onClick={() => onSeleccionar(hoy)}
            className="h-9 px-3 rounded-lg text-label-md text-on-surface font-semibold hover:bg-surface-container cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {calendar.today}
          </button>
          <button type="button" className={boton} aria-label={calendar.next} onClick={() => onSeleccionar(aFechaLocal(sumarMeses(mes, 1)))}>
            <Icon name="chevron_right" size={20} />
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-7 gap-1 transition-opacity ${cargando ? 'opacity-60' : ''}`} aria-busy={cargando}>
        {DIAS_CORTOS_LUNES.map((dia) => (
          <span key={dia} className="py-1 text-center text-label-sm uppercase text-secondary" aria-hidden="true">
            {dia}
          </span>
        ))}
        {diasDeCuadricula(mes).map((fecha) => {
          const clave = aFechaLocal(fecha)
          const total = porDia.get(clave) ?? 0
          const delMes = fecha.getMonth() === mes.getMonth()
          const activo = clave === seleccionado
          const etiqueta = `${new Intl.DateTimeFormat('es-MX', { dateStyle: 'full' }).format(fecha)}${total ? `, ${calendar.meetings(total)}` : ''}`
          return (
            <button
              key={clave}
              type="button"
              onClick={() => onSeleccionar(clave)}
              aria-pressed={activo}
              aria-label={etiqueta}
              className={`relative h-12 rounded-lg flex flex-col items-center justify-center gap-0.5 text-label-md tabular-nums cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                activo
                  ? 'bg-primary-container text-on-primary-container font-bold'
                  : clave === hoy
                    ? 'bg-primary-container/10 text-primary font-bold hover:bg-primary-container/20'
                    : delMes
                      ? 'text-on-surface hover:bg-surface-container'
                      : 'text-outline hover:bg-surface-container-low'
              }`}
            >
              {fecha.getDate()}
              {total > 0 && (
                <span className="flex gap-0.5" aria-hidden="true">
                  {Array.from({ length: Math.min(total, 3) }, (_, i) => (
                    <span key={i} className={`w-1.5 h-1.5 rounded-full ${activo ? 'bg-on-primary-container' : 'bg-primary'}`} />
                  ))}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
