import type { ReactNode } from 'react'
import { Icon } from './Icon'

interface EstadoVacioProps {
  icon: string
  titulo: string
  descripcion?: string
  children?: ReactNode
}

export function EstadoVacio({ icon, titulo, descripcion, children }: EstadoVacioProps) {
  return (
    <div className="py-12 flex flex-col items-center text-center gap-2">
      <span className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-outline">
        <Icon name={icon} size={26} />
      </span>
      <p className="text-label-lg text-on-surface font-semibold">{titulo}</p>
      {descripcion && <p className="text-body-sm text-secondary max-w-sm">{descripcion}</p>}
      {children}
    </div>
  )
}
