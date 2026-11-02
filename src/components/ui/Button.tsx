import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface BaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  className?: string
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-container text-on-primary hover:bg-primary shadow-sm hover:shadow-md shadow-primary-container/20',
  secondary:
    'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low shadow-sm',
  ghost:
    'bg-transparent text-on-surface hover:bg-surface-container hover:text-on-surface',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-label-md',
  md: 'h-10 px-space-md text-label-lg',
  lg: 'h-12 px-6 text-label-lg',
}

const baseStyles =
  'inline-flex items-center justify-center gap-space-xs rounded-lg font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary select-none cursor-pointer disabled:pointer-events-none disabled:opacity-50'

export type ButtonProps =
  | (BaseProps &
      Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
        to?: undefined
      })
  | (BaseProps &
      Omit<LinkProps, keyof BaseProps | 'to'> & {
        to: string
      })

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  to,
  ...props
}: ButtonProps) {
  const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...(props as Omit<LinkProps, keyof BaseProps | 'to'>)}>
        {children}
      </Link>
    )
  }

  const { type = 'button', ...buttonProps } = props as ButtonHTMLAttributes<HTMLButtonElement>

  return (
    <button type={type} className={combinedClasses} {...buttonProps}>
      {children}
    </button>
  )
}
