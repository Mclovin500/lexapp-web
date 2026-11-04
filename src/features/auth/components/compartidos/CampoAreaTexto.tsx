import { forwardRef, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { Icon } from '@/components/ui/Icon'
import { MensajeCampo } from '../CampoTexto'

export interface CampoAreaTextoProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string
  label: string
  icon: string
  /** Longitud actual (para el contador). */
  longitud: number
  maxLength: number
  error?: string
  labelHint?: ReactNode
}

/** Área de texto con contador de caracteres anunciado con `aria-live="polite"`. */
export const CampoAreaTexto = forwardRef<HTMLTextAreaElement, CampoAreaTextoProps>(
  ({ id, label, icon, longitud, maxLength, error, labelHint, className = '', ...props }, ref) => {
    const errorId = `${id}-error`
    const contadorId = `${id}-contador`

    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor={id} className="flex items-center gap-2 text-label-md text-on-surface font-medium">
            <Icon name={icon} size={18} className="text-secondary" />
            {label}
            {labelHint}
          </label>
          <span
            id={contadorId}
            aria-live="polite"
            className={`text-label-sm tabular-nums ${longitud >= maxLength ? 'text-error' : 'text-secondary'}`}
          >
            {longitud} / {maxLength}
          </span>
        </div>
        <textarea
          ref={ref}
          id={id}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${errorId} ${contadorId}` : contadorId}
          className={`w-full min-h-24 p-3 rounded-lg bg-surface-container-low text-body-md text-on-surface placeholder:text-outline resize-y focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all ${
            error ? 'border border-error ring-1 ring-error' : 'border border-transparent'
          } ${className}`}
          {...props}
        />
        {error && <MensajeCampo id={errorId} mensaje={error} />}
      </div>
    )
  },
)

CampoAreaTexto.displayName = 'CampoAreaTexto'
