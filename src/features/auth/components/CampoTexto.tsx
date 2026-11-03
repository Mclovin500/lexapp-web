import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'

export interface CampoTextoProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  icon: string
  error?: string
  /** Texto extra junto a la etiqueta, p. ej. "(opcional)". */
  labelHint?: ReactNode
}

/** Campo de texto con ícono, etiqueta y mensaje de error (estilo relleno de A3). */
export const CampoTexto = forwardRef<HTMLInputElement, CampoTextoProps>(
  ({ id, label, icon, error, labelHint, className = '', ...props }, ref) => {
    const errorId = `${id}-error`

    return (
      <div className="space-y-1.5">
        <label htmlFor={id} className="block text-label-md text-on-surface font-medium">
          {label}
          {labelHint && <span className="ml-1 text-secondary font-normal">{labelHint}</span>}
        </label>
        <div className="relative flex items-center">
          <span
            className="pointer-events-none absolute left-3.5 text-secondary flex items-center"
            aria-hidden="true"
          >
            <Icon name={icon} size={18} />
          </span>
          <input
            ref={ref}
            id={id}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={`w-full h-11 pl-10 pr-4 rounded-lg bg-surface-container-low text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all ${
              error ? 'border border-error ring-1 ring-error' : 'border border-transparent'
            } ${className}`}
            {...props}
          />
        </div>
        {error && <MensajeCampo id={errorId} mensaje={error} />}
      </div>
    )
  },
)

CampoTexto.displayName = 'CampoTexto'

export function MensajeCampo({ id, mensaje }: { id: string; mensaje: string }) {
  return (
    <p id={id} className="text-body-sm text-error flex items-center gap-1">
      <Icon name="error" size={16} />
      <span>{mensaje}</span>
    </p>
  )
}
