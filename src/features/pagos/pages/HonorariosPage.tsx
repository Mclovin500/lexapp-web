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
import { ResumenHonorarios } from '../components/ResumenHonorarios'
import { TablaMovimientos } from '../components/TablaMovimientos'
import { honorariosContent } from '../content/honorarios.content'
import { useMovimientos } from '../hooks/usePagos'
import { filtrosAUrl, filtrosDesdeUrl } from '../lib/filtros-url'
import type { FiltrosMovimientos } from '../types/pagos.types'

const botonSecundario =
  'inline-flex h-10 px-4 items-center justify-center gap-2 rounded-lg bg-surface-container-lowest text-on-surface text-label-md font-semibold shadow-sm hover:bg-surface-container transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

/** D3: centro de administración económica. Crear cobro → D4 · Movimiento → D5 · Cuenta → J1A. */
export function HonorariosPage() {
  const contenido = honorariosContent
  const [parametros, setParametros] = useSearchParams()
  const filtros = filtrosDesdeUrl(parametros)
  const listado = useMovimientos(filtros)
  const datos = listado.data

  const cambiar = (cambios: Partial<FiltrosMovimientos>) => {
    setParametros(filtrosAUrl({ ...filtros, ...cambios, pagina: cambios.pagina ?? 1 }))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <h1 className="text-headline-lg text-on-surface tracking-tight">{contenido.title}</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">{contenido.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={ROUTES.depositAccount} className={botonSecundario}>
            <Icon name="account_balance" size={18} />
            {contenido.actions.depositAccount}
          </Link>
          <Link to={ROUTES.proposals} className={botonSecundario}>
            <Icon name="request_quote" size={18} />
            {contenido.actions.proposals}
          </Link>
          <Link
            to={ROUTES.newCharge}
            className="inline-flex h-10 px-4 items-center justify-center gap-2 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary-container hover:text-on-primary text-label-md font-semibold shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Icon name="add_circle" size={18} />
            {contenido.actions.newCharge}
          </Link>
        </div>
      </div>

      <p className="flex items-start gap-2 p-3 rounded-lg bg-surface-container-low text-body-sm text-secondary">
        <Icon name="smartphone" size={18} className="shrink-0 mt-0.5" />
        {contenido.clientPaysNote}
      </p>

      <ResumenHonorarios />

      <section aria-labelledby="historial-cobros" className="flex flex-col gap-4">
        <h2 id="historial-cobros" className="text-headline-sm text-on-surface">
          {contenido.history.title}
        </h2>
        <FiltroPestanas
          ariaLabel={contenido.filters.ariaLabel}
          opciones={contenido.filters.options}
          valor={filtros.estado}
          totales={datos?.totalesPorEstado}
          onCambiar={(estado) => cambiar({ estado })}
        />
        <div className="flex flex-col md:flex-row gap-3">
          <BuscadorListado
            key={filtros.busqueda}
            id="movimientos-busqueda"
            label={contenido.filters.searchLabel}
            placeholder={contenido.filters.searchPlaceholder}
            valorInicial={filtros.busqueda}
            onBuscar={(busqueda) => cambiar({ busqueda })}
          />
          {filtros.propuestaId && (
            <button
              type="button"
              onClick={() => cambiar({ propuestaId: null })}
              aria-label={contenido.filters.clearProposal}
              className="inline-flex h-11 px-4 items-center gap-2 rounded-lg bg-primary-container/10 text-primary text-label-md font-semibold hover:bg-primary-container/20 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {contenido.filters.byProposal(filtros.propuestaId)}
              <Icon name="close" size={18} />
            </button>
          )}
        </div>

        {listado.isPending && <EstadoCarga texto={contenido.loading} />}
        {listado.isError && <EstadoError mensaje={MENSAJES_ERROR_API[listado.error.tipo]} onReintentar={() => void listado.refetch()} />}

        {datos &&
          (datos.movimientos.length === 0 ? (
            <div className="rounded-xl bg-surface-container-lowest shadow-sm">
              <EstadoVacio icon="payments" titulo={contenido.empty.title} descripcion={contenido.empty.description} />
            </div>
          ) : (
            <div className={`flex flex-col gap-4 transition-opacity ${listado.isPlaceholderData ? 'opacity-60' : ''}`} aria-busy={listado.isFetching}>
              <TablaMovimientos movimientos={datos.movimientos} />
              <Paginacion
                pagina={filtros.pagina}
                porPagina={filtros.porPagina}
                total={datos.total}
                etiqueta={contenido.paginationLabel}
                onCambiar={(pagina) => cambiar({ pagina })}
              />
            </div>
          ))}
      </section>
    </div>
  )
}
