import type { ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'

interface TarjetaAccesoProps {
  /** Ícono principal sobre el título. */
  icon: string
  title: string
  description?: ReactNode
  /** Fila superior de la tarjeta (sellos o paso actual). */
  ribbon?: ReactNode
  children: ReactNode
  /** Ancho máximo de la tarjeta. */
  ancho?: 'md' | 'lg'
}

const anchos = {
  md: 'max-w-xl',
  lg: 'max-w-5xl',
} as const

/** Tarjeta central de las pantallas de verificación y recuperación (A2A–A2C). */
export function TarjetaAcceso({
  icon,
  title,
  description,
  ribbon,
  children,
  ancho = 'md',
}: TarjetaAccesoProps) {
  return (
    <div
      className={`relative w-full ${anchos[ancho]} bg-surface-container-lowest rounded-xl shadow-xl shadow-on-surface/5 p-6 sm:p-10 flex flex-col`}
    >
      {ribbon && <div className="mb-8">{ribbon}</div>}

      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary-container mb-6 shadow-sm">
          <Icon name={icon} size={36} filled />
        </div>
        <h1 className="text-headline-lg text-on-surface mb-2 tracking-tight">{title}</h1>
        {description && (
          <div className="text-body-md text-secondary max-w-md mb-5 leading-relaxed">{description}</div>
        )}
      </div>

      {children}
    </div>
  )
}
