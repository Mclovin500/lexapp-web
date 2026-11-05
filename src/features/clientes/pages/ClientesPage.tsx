import { useSearchParams } from 'react-router-dom'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { BuscadorListado } from '@/components/ui/BuscadorListado'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { EstadoVacio } from '@/components/ui/EstadoVacio'
import { FiltroPestanas } from '@/components/ui/FiltroPestanas'
import { Paginacion } from '@/components/ui/Paginacion'
import { TablaClientes } from '../components/TablaClientes'
import { clientesContent } from '../content/clientes.content'
import { useListadoClientes } from '../hooks/useClientes'
import { filtrosAUrl, filtrosDesdeUrl } from '../lib/filtros-url'
import type { FiltrosClientes } from '../types/clientes.types'

/** F1: directorio de clientes relacionados con el abogado. Seleccionar uno → F2. */
export function ClientesPage() {
  const contenido = clientesContent
  const [parametros, setParametros] = useSearchParams()
  const filtros = filtrosDesdeUrl(parametros)
  const listado = useListadoClientes(filtros)
  const datos = listado.data

  const cambiar = (cambios: Partial<FiltrosClientes>) => {
    setParametros(filtrosAUrl({ ...filtros, ...cambios, pagina: cambios.pagina ?? 1 }))
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-headline-lg text-on-surface tracking-tight">{contenido.title}</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">{contenido.subtitle}</p>
      </div>

      <FiltroPestanas
        ariaLabel={contenido.filters.ariaLabel}
        opciones={contenido.filters.options}
        valor={filtros.estado}
        totales={datos?.totalesPorEstado}
        onCambiar={(estado) => cambiar({ estado })}
      />
      <BuscadorListado
        key={filtros.busqueda}
        id="clientes-busqueda"
        label={contenido.filters.searchLabel}
        placeholder={contenido.filters.searchPlaceholder}
        valorInicial={filtros.busqueda}
        onBuscar={(busqueda) => cambiar({ busqueda })}
      />

      {listado.isPending && <EstadoCarga texto={contenido.loading} />}
      {listado.isError && <EstadoError mensaje={MENSAJES_ERROR_API[listado.error.tipo]} onReintentar={() => void listado.refetch()} />}

      {datos &&
        (datos.clientes.length === 0 ? (
          <div className="rounded-xl bg-surface-container-lowest shadow-sm">
            <EstadoVacio icon="groups" titulo={contenido.empty.title} descripcion={contenido.empty.description} />
          </div>
        ) : (
          <div className={`flex flex-col gap-4 transition-opacity ${listado.isPlaceholderData ? 'opacity-60' : ''}`} aria-busy={listado.isFetching}>
            <TablaClientes clientes={datos.clientes} />
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
