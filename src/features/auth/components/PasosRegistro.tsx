import { Icon } from '@/components/ui/Icon'
import { registroContent } from '../content/registro.content'

interface PasosRegistroProps {
  /** Índice de la etapa actual (0 = Datos básicos). */
  pasoActual: number
}

/** Indicador de etapas del registro. Reutilizable en A4 y A5. */
export function PasosRegistro({ pasoActual }: PasosRegistroProps) {
  const { items, status, ariaLabel } = registroContent.steps
  const progreso = Math.min(((pasoActual + 0.5) / (items.length - 1)) * 100, 100)

  return (
    <nav aria-label={ariaLabel} className="w-full mt-7 mb-8 px-2">
      <ol className="relative flex items-start justify-between">
        {/* Línea de conexión */}
        <div className="absolute left-6 right-6 top-4 h-0.5 -translate-y-1/2 bg-surface-container-highest" aria-hidden="true">
          <div className="h-full bg-primary-container transition-all" style={{ width: `${progreso}%` }} />
        </div>

        {items.map((etiqueta, indice) => {
          const esActual = indice === pasoActual
          const completado = indice < pasoActual

          return (
            <li
              key={etiqueta}
              aria-current={esActual ? 'step' : undefined}
              className="relative z-10 flex flex-col items-center"
            >
              <span
                className={`w-8 h-8 rounded-full text-label-md flex items-center justify-center ring-4 ring-surface-container-lowest ${
                  esActual || completado
                    ? 'bg-primary-container text-on-primary shadow-md shadow-primary-container/30'
                    : 'bg-surface-container text-secondary'
                }`}
              >
                {completado ? (
                  <Icon name="check" size={16} />
                ) : esActual ? (
                  <Icon name="edit_note" size={16} />
                ) : (
                  indice + 1
                )}
              </span>
              <span
                className={`text-label-sm mt-2 text-center ${
                  esActual ? 'text-on-surface font-semibold tracking-wide' : 'text-secondary font-medium'
                }`}
              >
                {etiqueta}
              </span>
              <span
                className={`text-[10px] tracking-wider ${
                  esActual ? 'text-primary font-bold uppercase' : 'text-outline font-medium'
                }`}
              >
                {esActual ? status.current : completado ? status.done : status.pending}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
