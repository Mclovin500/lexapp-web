import { useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { BuscadorListado } from '@/components/ui/BuscadorListado'
import { Dialogo } from '@/components/ui/Dialogo'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { EstadoVacio } from '@/components/ui/EstadoVacio'
import { FiltroPestanas } from '@/components/ui/FiltroPestanas'
import { Icon } from '@/components/ui/Icon'
import { Paginacion } from '@/components/ui/Paginacion'
import { DetallePropuesta } from '../components/DetallePropuesta'
import { TablaPropuestas } from '../components/TablaPropuestas'
import { propuestasContent } from '../content/propuestas.content'
import { useCancelarPropuesta, useListadoPropuestas } from '../hooks/usePropuestas'
import { filtrosAUrl, filtrosDesdeUrl } from '../lib/filtros-url'
import type { EstadoPropuestaGuardada, FiltrosPropuestas, PropuestaResumen } from '../types/propuestas.types'

function esEstadoGuardada(valor: unknown): valor is EstadoPropuestaGuardada {
  if (typeof valor !== 'object' || valor === null) return false
  const guardada = (valor as Record<string, unknown>).propuestaGuardada
  return guardada === 'borrador' || guardada === 'enviada'
}

/** D2: seguimiento de propuestas (D1 → D2; aceptada → E2, flujo 6.6). */
export function PropuestasPage() {
  const contenido = propuestasContent
  const { state } = useLocation()
  const [parametros, setParametros] = useSearchParams()
  const filtros = filtrosDesdeUrl(parametros)
  const listado = useListadoPropuestas(filtros)
  const cancelar = useCancelarPropuesta()
  const datos = listado.data

  const [verId, setVerId] = useState<string | null>(null)
  const [porCancelar, setPorCancelar] = useState<PropuestaResumen | null>(null)
  const [cancelada, setCancelada] = useState(false)
  const aviso = cancelada ? contenido.cancelled : esEstadoGuardada(state) ? contenido.saved[state.propuestaGuardada] : null

  const cambiar = (cambios: Partial<FiltrosPropuestas>) => {
    setParametros(filtrosAUrl({ ...filtros, ...cambios, pagina: cambios.pagina ?? 1 }))
  }

  const confirmarCancelacion = () => {
    if (!porCancelar) return
    cancelar.mutate(porCancelar.id, {
      onSuccess: () => {
        setPorCancelar(null)
        setCancelada(true)
      },
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-headline-lg text-on-surface tracking-tight">{contenido.title}</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">{contenido.subtitle}</p>
        </div>
        <Link
          to={ROUTES.newProposal}
          className="inline-flex h-10 px-4 items-center justify-center gap-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-label-md font-semibold shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Icon name="post_add" size={18} />
          {contenido.newProposal}
        </Link>
      </div>

      {aviso && (
        <p role="status" className="p-3 rounded-lg bg-primary-container/10 text-primary text-body-sm flex items-center gap-2">
          <Icon name="check_circle" size={18} />
          {aviso}
        </p>
      )}

      <FiltroPestanas
        ariaLabel={contenido.filters.ariaLabel}
        opciones={contenido.filters.options}
        valor={filtros.estado}
        totales={datos?.totalesPorEstado}
        onCambiar={(estado) => cambiar({ estado })}
      />
      <BuscadorListado
        key={filtros.busqueda}
        id="propuestas-busqueda"
        label={contenido.filters.searchLabel}
        placeholder={contenido.filters.searchPlaceholder}
        valorInicial={filtros.busqueda}
        onBuscar={(busqueda) => cambiar({ busqueda })}
      />

      {listado.isPending && <EstadoCarga texto={contenido.loading} />}
      {listado.isError && <EstadoError mensaje={MENSAJES_ERROR_API[listado.error.tipo]} onReintentar={() => void listado.refetch()} />}

      {datos &&
        (datos.propuestas.length === 0 ? (
          <div className="rounded-xl bg-surface-container-lowest shadow-sm">
            <EstadoVacio icon="request_quote" titulo={contenido.empty.title} descripcion={contenido.empty.description} />
          </div>
        ) : (
          <div className={`flex flex-col gap-4 transition-opacity ${listado.isPlaceholderData ? 'opacity-60' : ''}`} aria-busy={listado.isFetching}>
            <TablaPropuestas propuestas={datos.propuestas} onVer={setVerId} onCancelar={setPorCancelar} />
            <Paginacion
              pagina={filtros.pagina}
              porPagina={filtros.porPagina}
              total={datos.total}
              etiqueta={contenido.paginationLabel}
              onCambiar={(pagina) => cambiar({ pagina })}
            />
          </div>
        ))}

      <Dialogo
        abierto={verId !== null}
        onCerrar={() => setVerId(null)}
        titulo={contenido.actions.view}
        ancho="lg"
      >
        {verId && <DetallePropuesta propuestaId={verId} />}
      </Dialogo>

      <Dialogo
        abierto={porCancelar !== null}
        onCerrar={() => {
          setPorCancelar(null)
          cancelar.reset()
        }}
        titulo={contenido.cancelDialog.title}
        descripcion={contenido.cancelDialog.description}
      >
        {porCancelar && (
          <div className="flex flex-col gap-4">
            <p className="text-body-md text-on-surface">
              <strong>{porCancelar.folio}</strong> · {porCancelar.servicio} · {porCancelar.cliente.nombre}
            </p>
            {cancelar.isError && (
              <EstadoError
                mensaje={cancelar.error.tipo === 'conflicto' ? contenido.errors.conflicto : MENSAJES_ERROR_API[cancelar.error.tipo]}
              />
            )}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
              <button
                type="button"
                onClick={() => setPorCancelar(null)}
                className="h-10 px-4 rounded-lg bg-surface-container text-label-md font-semibold hover:bg-surface-container-high cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {contenido.cancelDialog.keep}
              </button>
              <button
                type="button"
                onClick={confirmarCancelacion}
                disabled={cancelar.isPending}
                className="h-10 px-4 rounded-lg bg-error text-on-error text-label-md font-semibold hover:opacity-90 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
              >
                {cancelar.isPending ? contenido.cancelDialog.confirming : contenido.cancelDialog.confirm}
              </button>
            </div>
          </div>
        )}
      </Dialogo>
    </div>
  )
}
