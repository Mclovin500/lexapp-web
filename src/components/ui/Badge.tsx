import type { HTMLAttributes, ReactNode } from 'react'

type BadgeVariant = 'default' | 'primary' | 'surface' | 'error' | 'secondary'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-container text-on-surface',
  primary: 'bg-primary-container/10 text-primary-container',
  surface: 'bg-surface-container-lowest text-primary shadow-sm',
  error: 'bg-error-container text-on-error-container',
  secondary: 'bg-secondary-container text-on-secondary-container',
}

export function Badge({
  children,
  variant = 'default',
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-space-xs rounded-full px-3 py-1 text-label-sm font-semibold uppercase tracking-wider ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
