import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'

interface PanelSeccionProps {
  id: string
  icon: string
  title: string
  subtitle?: string
  accion?: { to: string; label: string }
  destacado?: boolean
  children: ReactNode
}

/** Tarjeta de sección del Dashboard con título y enlace opcional. */
export function PanelSeccion({ id, icon, title, subtitle, accion, destacado = false, children }: PanelSeccionProps) {
  return (
    <section
      aria-labelledby={id}
      className={`rounded-xl bg-surface-container-lowest shadow-sm p-5 sm:p-6 ${destacado ? 'ring-1 ring-primary-container/40' : ''}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <span
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              destacado ? 'bg-primary-container text-on-primary' : 'bg-surface-container-low text-primary'
            }`}
          >
            <Icon name={icon} size={20} />
          </span>
          <div>
            <h2 id={id} className="text-headline-sm text-on-surface">
              {title}
            </h2>
            {subtitle && <p className="text-body-sm text-secondary">{subtitle}</p>}
          </div>
        </div>
        {accion && (
          <Link
            to={accion.to}
            className="inline-flex items-center gap-1 text-label-md text-primary font-semibold hover:underline rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {accion.label}
            <Icon name="arrow_forward" size={16} />
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}
