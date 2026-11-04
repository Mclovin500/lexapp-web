import { prioridadesSolicitud } from '../content/solicitudes.content'
import type { PrioridadSolicitud } from '../types/solicitudes.types'

/** "Prioridad, si corresponde": sin prioridad no se muestra nada. */
export function EtiquetaPrioridad({ prioridad }: { prioridad: PrioridadSolicitud | null }) {
  if (!prioridad) return null
  const { label, clases } = prioridadesSolicitud[prioridad]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${clases}`}>
      {label}
    </span>
  )
}
