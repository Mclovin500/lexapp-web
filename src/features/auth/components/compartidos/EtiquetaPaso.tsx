import { Icon } from '@/components/ui/Icon'

interface EtiquetaPasoProps {
  icon: string
  label: string
}

/** Pastilla discreta para indicar el paso o el protocolo en la parte superior de una tarjeta. */
export function EtiquetaPaso({ icon, label }: EtiquetaPasoProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-label-sm uppercase tracking-wider">
      <Icon name={icon} size={14} className="text-primary" />
      {label}
    </span>
  )
}
