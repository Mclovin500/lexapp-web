import { useSearchParams } from 'react-router-dom'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { EstadoVacio } from '@/components/ui/EstadoVacio'
import { Paginacion } from '@/components/ui/Paginacion'
import { FiltrosSolicitudes } from '../components/FiltrosSolicitudes'
import { TablaSolicitudes } from '../components/TablaSolicitudes'
import { solicitudesContent } from '../content/solicitudes.content'
import { useListadoSolicitudes } from '../hooks/useSolicitudes'
import { filtrosAUrl, filtrosDesdeUrl } from '../lib/filtros-url'
import type { FiltrosSolicitudes as Filtros } from '../types/solicitudes.types'

/** C1: solicitudes recibidas. Seleccionar una → C2. Filtros en la URL. */
export function SolicitudesPage() {
  const contenido = solicitudesContent
  const [parametros, setParametros] = useSearchParams()
  const filtros = filtrosDesdeUrl(parametros)
  const listado = useListadoSolicitudes(filtros)
  const datos = listado.data

  const cambiar = (cambios: Partial<Filtros>) => {
    // Cualquier filtro nuevo regresa a la primera página.
    const siguiente = { ...filtros, ...cambios, pagina: cambios.pagina ?? 1 }
    setParametros(filtrosAUrl(siguiente))
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-headline-lg text-on-surface tracking-tight">{contenido.title}</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">{contenido.subtitle}</p>
      </div>

      <FiltrosSolicitudes
        key={filtros.busqueda}
        filtros={filtros}
        totales={datos?.totalesPorEstado}
        onCambiar={cambiar}
      />

      {listado.isPending && <EstadoCarga texto={contenido.loading} />}

      {listado.isError && (
        <EstadoError mensaje={MENSAJES_ERROR_API[listado.error.tipo]} onReintentar={() => void listado.refetch()} />
      )}

      {datos &&
        (datos.solicitudes.length === 0 ? (
          <div className="rounded-xl bg-surface-container-lowest shadow-sm">
            <EstadoVacio icon="inbox" titulo={contenido.empty.title} descripcion={contenido.empty.description} />
          </div>
        ) : (
          <div className={`flex flex-col gap-4 transition-opacity ${listado.isPlaceholderData ? 'opacity-60' : ''}`} aria-busy={listado.isFetching}>
            <TablaSolicitudes solicitudes={datos.solicitudes} />
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
