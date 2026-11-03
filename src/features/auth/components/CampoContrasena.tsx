import { useState, forwardRef, type InputHTMLAttributes } from 'react'
import { Icon } from '@/components/ui/Icon'
import { loginContent } from '../content/login.content'

export interface CampoContrasenaProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string
  error?: string
  describedBy?: string
  /** Ícono de la izquierda (por defecto `lock`). */
  icon?: string
  /** `borde`: estilo del login (P02). `relleno`: estilo del registro (A3). */
  variante?: 'borde' | 'relleno'
}

const varianteStyles = {
  borde: {
    base: 'bg-surface-container-lowest shadow-sm',
    normal: 'border border-outline-variant/30',
  },
  relleno: {
    base: 'bg-surface-container-low focus:bg-surface-container-lowest',
    normal: 'border border-transparent',
  },
} as const

export const CampoContrasena = forwardRef<HTMLInputElement, CampoContrasenaProps>(
  (
    {
      id,
      error,
      describedBy,
      icon = 'lock',
      variante = 'borde',
      autoComplete = 'current-password',
      placeholder = loginContent.form.passwordPlaceholder,
      className = '',
      ...props
    },
    ref,
  ) => {
    const [mostrarContrasena, setMostrarContrasena] = useState(false)

    const toggleMostrar = () => {
      setMostrarContrasena((prev) => !prev)
    }

    const ariaLabel = mostrarContrasena
      ? loginContent.form.hidePasswordAriaLabel
      : loginContent.form.showPasswordAriaLabel

    const estilos = varianteStyles[variante]

    return (
      <div className="relative flex items-center">
        <span
          className="pointer-events-none absolute left-3.5 text-secondary flex items-center justify-center"
          aria-hidden="true"
        >
          <Icon name={icon} size={20} />
        </span>
        <input
          {...props}
          ref={ref}
          id={id}
          type={mostrarContrasena ? 'text' : 'password'}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          placeholder={placeholder}
          className={`w-full h-11 pl-11 pr-11 text-on-surface font-body-md text-body-md rounded-lg placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary-container transition-colors ${
            estilos.base
          } ${error ? 'border border-error ring-1 ring-error' : estilos.normal} ${className}`}
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
