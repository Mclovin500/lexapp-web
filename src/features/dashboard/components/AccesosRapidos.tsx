import { Link } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import { dashboardContent } from '../content/dashboard.content'

export function AccesosRapidos() {
  const { quickAccess } = dashboardContent
  return (
    <nav aria-label={quickAccess.title} className="flex flex-wrap gap-2">
      {quickAccess.items.map((item, indice) => (
        <Link
          key={item.to}
          to={item.to}
          className={`inline-flex h-10 px-4 items-center gap-2 rounded-lg text-label-md font-semibold shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            indice === 1
              ? 'bg-primary-container hover:bg-primary text-on-primary'
              : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface'
          }`}
        >
          <Icon name={item.icon} size={18} />
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
