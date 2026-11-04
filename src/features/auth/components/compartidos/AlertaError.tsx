import type { ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'

interface AlertaErrorProps {
  children: ReactNode
  id?: string
}

/** Caja de error del servidor con `role="alert"`. */
export function AlertaError({ children, id }: AlertaErrorProps) {
  return (
    <div
      id={id}
      role="alert"
      className="w-full p-3.5 rounded-lg bg-error-container text-on-error-container text-body-sm flex items-start gap-2.5 border border-error/20"
    >
      <Icon name="error" size={20} className="text-error shrink-0 mt-0.5" />
      <div className="leading-snug">{children}</div>
    </div>
  )
}
