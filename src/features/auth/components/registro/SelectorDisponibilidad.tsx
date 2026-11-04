import type { UseFormRegisterReturn } from 'react-hook-form'
import { Icon } from '@/components/ui/Icon'
import type { OpcionDisponibilidad } from '../../content/catalogos.content'
import { MensajeCampo } from '../CampoTexto'

interface SelectorDisponibilidadProps {
  legend: string
  opciones: OpcionDisponibilidad[]
  /** Valor actual, para resaltar la tarjeta elegida. */
  value: string
  registro: UseFormRegisterReturn
  error?: string
}

/** Grupo de tarjetas tipo radio (radios nativos: Tab y flechas funcionan). */
export function SelectorDisponibilidad({
  legend,
  opciones,
  value,
  registro,
  error,
}: SelectorDisponibilidadProps) {
  return (
    <fieldset className="space-y-2" aria-describedby={error ? 'disponibilidad-error' : undefined}>
      <legend className="flex items-center gap-2 text-label-md text-on-surface font-medium mb-2">
        <Icon name="event_available" size={18} className="text-secondary" />
        {legend}
      </legend>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {opciones.map((opcion) => {
          const activa = value === opcion.valor
          return (
            <label
              key={opcion.valor}
              className={`relative flex flex-col gap-1 p-3 rounded-lg cursor-pointer transition-all has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary ${
                activa
                  ? 'bg-primary-container/10 ring-2 ring-primary-container'
                  : 'bg-surface-container-low hover:bg-surface-container'
              }`}
            >
              <input type="radio" value={opcion.valor} className="sr-only" {...registro} />
              <span className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-primary">
                  {opcion.insignia}
                </span>
                {activa && <Icon name="check_circle" size={16} filled className="text-primary-container" />}
              </span>
              <span className="text-label-md text-on-surface font-semibold">{opcion.etiqueta}</span>
              <span className="text-[11px] text-secondary leading-snug">{opcion.descripcion}</span>
            </label>
          )
        })}
      </div>
      {error && <MensajeCampo id="disponibilidad-error" mensaje={error} />}
    </fieldset>
  )
}
