import { Icon } from '@/components/ui/Icon'
import { formatearRelativa } from '@/lib/fechas'
import { dashboardContent } from '../content/dashboard.content'
import type { ActividadReciente } from '../types/dashboard.types'

export function ListaActividad({ actividades }: { actividades: ActividadReciente[] }) {
  const { activity } = dashboardContent

  if (actividades.length === 0) {
    return <p className="text-body-md text-secondary py-4">{activity.empty}</p>
  }

  return (
    <ol className="relative space-y-4 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-surface-container">
      {actividades.map((actividad) => (
        <li key={actividad.id} className="relative flex items-start gap-3">
          <span className="relative z-10 w-8 h-8 rounded-full bg-surface-container-low text-primary flex items-center justify-center shrink-0">
            <Icon name={activity.icons[actividad.tipo]} size={16} />
          </span>
          <div className="pt-1">
            <p className="text-body-md text-on-surface">{actividad.descripcion}</p>
            <p className="text-body-sm text-secondary">{formatearRelativa(actividad.fecha)}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
