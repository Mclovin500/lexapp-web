import { Link } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'

interface TarjetaIndicadorProps {
  label: string
  valor: number
  icon: string
  to: string
  destacada?: boolean
}

export function TarjetaIndicador({ label, valor, icon, to, destacada = false }: TarjetaIndicadorProps) {
  return (
    <Link
      to={to}
      className={`group flex items-start justify-between gap-3 p-5 rounded-xl shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        destacada ? 'bg-primary-container text-on-primary' : 'bg-surface-container-lowest text-on-surface'
      }`}
    >
      <div>
        <p className={`text-label-md ${destacada ? 'text-on-primary/90' : 'text-secondary'}`}>{label}</p>
        <p className="mt-1 text-display-lg tabular-nums">{valor}</p>
      </div>
      <span
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          destacada ? 'bg-on-primary/15' : 'bg-surface-container-low text-primary'
        }`}
      >
        <Icon name={icon} size={22} />
      </span>
    </Link>
  )
}
