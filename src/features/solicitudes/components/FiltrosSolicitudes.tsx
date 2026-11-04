import { useState, type FormEvent } from 'react'
import { Icon } from '@/components/ui/Icon'
import { areasJuridicas, solicitudesContent } from '../content/solicitudes.content'
import type {
  FiltroEstadoSolicitud,
  FiltrosSolicitudes as Filtros,
  RespuestaListadoSolicitudes,
} from '../types/solicitudes.types'

interface FiltrosSolicitudesProps {
  filtros: Filtros
  totales?: RespuestaListadoSolicitudes['totalesPorEstado']
  onCambiar: (cambios: Partial<Filtros>) => void
}

/** Filtros de C1: estado (Todas/Nuevas/En revisión/Atendidas), área jurídica y búsqueda. */
export function FiltrosSolicitudes({ filtros, totales, onCambiar }: FiltrosSolicitudesProps) {
  const { filtros: textos } = solicitudesContent
  const [busqueda, setBusqueda] = useState(filtros.busqueda)
  const hayFiltros = filtros.estado !== 'todas' || filtros.area !== null || filtros.busqueda !== ''

  const buscar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    onCambiar({ busqueda: busqueda.trim() })
  }

  const limpiar = () => {
    setBusqueda('')
    onCambiar({ estado: 'todas', area: null, busqueda: '' })
  }

  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label={textos.ariaLabel} className="flex flex-wrap gap-2">
        {textos.estados.map((opcion) => {
          const activo = opcion.valor === filtros.estado
          return (
            <button
              key={opcion.valor}
              type="button"
              aria-pressed={activo}
              onClick={() => onCambiar({ estado: opcion.valor as FiltroEstadoSolicitud })}
              className={`inline-flex h-9 px-4 items-center gap-2 rounded-full text-label-md transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                activo ? 'bg-on-surface text-surface font-semibold' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container shadow-sm'
              }`}
            >
              {opcion.label}
              {totales && (
                <span className={`text-[11px] tabular-nums px-1.5 rounded-full ${activo ? 'bg-surface/20' : 'bg-surface-container'}`}>
                  {totales[opcion.valor]}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <form role="search" onSubmit={buscar} className="relative flex-1 flex">
          <label htmlFor="solicitudes-busqueda" className="sr-only">
            {textos.searchLabel}
          </label>
          <Icon name="search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
          <input
            id="solicitudes-busqueda"
            type="search"
            value={busqueda}
            maxLength={100}
            onChange={(evento) => setBusqueda(evento.target.value)}
            placeholder={textos.searchPlaceholder}
            className="w-full h-11 pl-10 pr-24 rounded-lg bg-surface-container-lowest shadow-sm text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-3 rounded-md bg-surface-container text-label-md text-on-surface hover:bg-surface-container-high cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Buscar
          </button>
        </form>

        <div className="relative md:w-72">
          <label htmlFor="solicitudes-area" className="sr-only">
            {textos.areaLabel}
          </label>
          <select
            id="solicitudes-area"
            value={filtros.area ?? ''}
            onChange={(evento) => onCambiar({ area: evento.target.value || null })}
            className="w-full h-11 pl-3 pr-10 appearance-none rounded-lg bg-surface-container-lowest shadow-sm text-body-md text-on-surface cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-container"
          >
            <option value="">{textos.areaAll}</option>
            {areasJuridicas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          <Icon name="expand_more" size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
        </div>

        {hayFiltros && (
          <button
            type="button"
            onClick={limpiar}
            className="inline-flex h-11 px-4 items-center justify-center gap-1.5 rounded-lg text-label-md text-secondary hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Icon name="filter_alt_off" size={18} />
            {textos.clear}
          </button>
        )}
      </div>
    </div>
  )
}
