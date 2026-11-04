import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react'
import { Icon } from '@/components/ui/Icon'
import type { OpcionCatalogo } from '../../content/catalogos.content'
import { MensajeCampo } from '../CampoTexto'

export interface CampoSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string
  label: string
  icon: string
  opciones: OpcionCatalogo[]
  placeholder: string
  error?: string
  labelHint?: ReactNode
}

/** Select nativo con ícono, etiqueta y error, con el mismo estilo que `CampoTexto`. */
export const CampoSelect = forwardRef<HTMLSelectElement, CampoSelectProps>(
  ({ id, label, icon, opciones, placeholder, error, labelHint, className = '', ...props }, ref) => {
    const errorId = `${id}-error`

    return (
      <div className="space-y-1.5">
        <label htmlFor={id} className="flex items-center gap-2 text-label-md text-on-surface font-medium">
          {label}
          {labelHint}
        </label>
        <div className="relative flex items-center">
          <span className="pointer-events-none absolute left-3.5 text-secondary flex items-center" aria-hidden="true">
            <Icon name={icon} size={18} />
          </span>
          <select
            ref={ref}
            id={id}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={`w-full h-11 pl-10 pr-10 appearance-none rounded-lg bg-surface-container-low text-body-md text-on-surface cursor-pointer focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all ${
              error ? 'border border-error ring-1 ring-error' : 'border border-transparent'
            } ${className}`}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {opciones.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 text-secondary flex items-center" aria-hidden="true">
            <Icon name="expand_more" size={20} />
          </span>
        </div>
        {error && <MensajeCampo id={errorId} mensaje={error} />}
      </div>
    )
  },
)

CampoSelect.displayName = 'CampoSelect'
