import { Link, useSearchParams } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { BuscadorListado } from '@/components/ui/BuscadorListado'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { EstadoVacio } from '@/components/ui/EstadoVacio'
import { FiltroPestanas } from '@/components/ui/FiltroPestanas'
import { Icon } from '@/components/ui/Icon'
import { Paginacion } from '@/components/ui/Paginacion'
import { areasJuridicas } from '@/features/solicitudes/content/solicitudes.content'
import { TablaExpedientes } from '../components/TablaExpedientes'
import { expedientesContent } from '../content/expedientes.content'
import { useListadoExpedientes } from '../hooks/useExpedientes'
import { filtrosAUrl, filtrosDesdeUrl } from '../lib/filtros-url'
import type { FiltrosExpedientes } from '../types/expedientes.types'

/** E1: expedientes administrados por el abogado. Seleccionar uno → E2. Filtros en la URL. */
export function ExpedientesPage() {
  const contenido = expedientesContent
  const { filters } = contenido
  const [parametros, setParametros] = useSearchParams()
  const filtros = filtrosDesdeUrl(parametros)
  const listado = useListadoExpedientes(filtros)
  const datos = listado.data
  const hayFiltros = filtros.estado !== 'todos' || filtros.area !== null || filtros.busqueda !== ''

  const cambiar = (cambios: Partial<FiltrosExpedientes>) => {
    setParametros(filtrosAUrl({ ...filtros, ...cambios, pagina: cambios.pagina ?? 1 }))
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-headline-lg text-on-surface tracking-tight">{contenido.title}</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">{contenido.subtitle}</p>
      </div>

      <FiltroPestanas
        ariaLabel={filters.ariaLabel}
        opciones={filters.options}
        valor={filtros.estado}
        totales={datos?.totalesPorEstado}
        onCambiar={(estado) => cambiar({ estado })}
      />

      <div className="flex flex-col md:flex-row gap-3">
        <BuscadorListado
          key={filtros.busqueda}
          id="expedientes-busqueda"
          label={filters.searchLabel}
          placeholder={filters.searchPlaceholder}
          valorInicial={filtros.busqueda}
          onBuscar={(busqueda) => cambiar({ busqueda })}
        />
        <div className="relative md:w-72">
          <label htmlFor="expedientes-area" className="sr-only">
            {filters.areaLabel}
          </label>
          <select
            id="expedientes-area"
            value={filtros.area ?? ''}
            onChange={(evento) => cambiar({ area: evento.target.value || null })}
            className="w-full h-11 pl-3 pr-10 appearance-none rounded-lg bg-surface-container-lowest shadow-sm text-body-md text-on-surface cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-container"
          >
            <option value="">{filters.areaAll}</option>
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
            onClick={() => setParametros({})}
            className="inline-flex h-11 px-4 items-center justify-center gap-1.5 rounded-lg text-label-md text-secondary hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Icon name="filter_alt_off" size={18} />
            {filters.clear}
          </button>
        )}
      </div>

      {listado.isPending && <EstadoCarga texto={contenido.loading} />}
      {listado.isError && <EstadoError mensaje={MENSAJES_ERROR_API[listado.error.tipo]} onReintentar={() => void listado.refetch()} />}

      {datos &&
        (datos.expedientes.length === 0 ? (
          <div className="rounded-xl bg-surface-container-lowest shadow-sm">
            <EstadoVacio icon="folder_managed" titulo={contenido.empty.title} descripcion={contenido.empty.description}>
              <Link to={ROUTES.proposals} className="mt-2 text-label-md text-primary font-semibold hover:underline">
                {contenido.empty.proposals}
              </Link>
            </EstadoVacio>
          </div>
        ) : (
          <div className={`flex flex-col gap-4 transition-opacity ${listado.isPlaceholderData ? 'opacity-60' : ''}`} aria-busy={listado.isFetching}>
            <TablaExpedientes expedientes={datos.expedientes} />
            <Paginacion
              pagina={filtros.pagina}
              porPagina={filtros.porPagina}
              total={datos.total}
              etiqueta={contenido.paginationLabel}
              onCambiar={(pagina) => cambiar({ pagina })}
            />
          </div>
        ))}
    </div>
  )
}
