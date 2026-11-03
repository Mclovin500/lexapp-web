import { useState, forwardRef, type InputHTMLAttributes } from 'react'
import { Icon } from '@/components/ui/Icon'
import { loginContent } from '../content/login.content'

export interface CampoContrasenaProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string
  error?: string
  describedBy?: string
}

export const CampoContrasena = forwardRef<HTMLInputElement, CampoContrasenaProps>(
  ({ id, error, describedBy, className = '', ...props }, ref) => {
    const [mostrarContrasena, setMostrarContrasena] = useState(false)

    const toggleMostrar = () => {
      setMostrarContrasena((prev) => !prev)
    }

    const ariaLabel = mostrarContrasena
      ? loginContent.form.hidePasswordAriaLabel
      : loginContent.form.showPasswordAriaLabel

    return (
      <div className="relative flex items-center">
        <span
          className="pointer-events-none absolute left-3.5 text-secondary flex items-center justify-center"
          aria-hidden="true"
        >
          <Icon name="lock" size={20} />
        </span>
        <input
          {...props}
          ref={ref}
          id={id}
          type={mostrarContrasena ? 'text' : 'password'}
          autoComplete="current-password"
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          placeholder={loginContent.form.passwordPlaceholder}
          className={`w-full h-11 pl-11 pr-11 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg shadow-sm placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary-container transition-colors ${
            error ? 'border border-error ring-1 ring-error' : 'border border-outline-variant/30'
          } ${className}`}
        />
        <button
          type="button"
          onClick={toggleMostrar}
          aria-label={ariaLabel}
          aria-pressed={mostrarContrasena}
          className="absolute right-3.5 text-secondary hover:text-on-surface transition-colors p-1 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer flex items-center justify-center"
        >
          <Icon
            name={mostrarContrasena ? 'visibility_off' : 'visibility'}
            size={20}
          />
        </button>
      </div>
    )
  },
)

CampoContrasena.displayName = 'CampoContrasena'

