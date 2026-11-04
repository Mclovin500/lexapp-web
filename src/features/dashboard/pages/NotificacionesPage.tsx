import { useSearchParams } from 'react-router-dom'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { EstadoVacio } from '@/components/ui/EstadoVacio'
import { Icon } from '@/components/ui/Icon'
import { ItemNotificacion } from '../components/ItemNotificacion'
import { notificacionesContent } from '../content/notificaciones.content'
import {
  useMarcarNotificacionLeida,
  useMarcarTodasLeidas,
  useNotificaciones,
} from '../hooks/useNotificaciones'
import type { FiltroNotificaciones } from '../types/notificaciones.types'

const FILTROS: FiltroNotificaciones[] = ['todas', 'no_leidas', 'leidas']

function leerFiltro(valor: string | null): FiltroNotificaciones {
  return FILTROS.find((filtro) => filtro === valor) ?? 'todas'
}

/** B1A: se abre desde la campana del Header (no desde el Sidebar). */
export function NotificacionesPage() {
  const contenido = notificacionesContent
  const [parametros, setParametros] = useSearchParams()
  const filtro = leerFiltro(parametros.get('filtro'))

  const notificaciones = useNotificaciones(filtro)
  const marcar = useMarcarNotificacionLeida()
  const marcarTodas = useMarcarTodasLeidas()
  const datos = notificaciones.data
  const hayNoLeidas = (datos?.totales.no_leidas ?? 0) > 0

  const cambiarFiltro = (nuevo: FiltroNotificaciones) => {
    setParametros(nuevo === 'todas' ? {} : { filtro: nuevo })
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-headline-lg text-on-surface tracking-tight">{contenido.title}</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">{contenido.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => marcarTodas.mutate()}
          disabled={!hayNoLeidas || marcarTodas.isPending}
          className="inline-flex h-10 px-4 items-center justify-center gap-2 rounded-lg bg-surface-container-lowest text-on-surface text-label-md font-semibold shadow-sm hover:bg-surface-container transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Icon name="done_all" size={18} />
          {marcarTodas.isPending ? contenido.markingAll : contenido.markAll}
        </button>
      </div>

      <div role="group" aria-label={contenido.filters.ariaLabel} className="flex flex-wrap gap-2">
        {contenido.filters.options.map((opcion) => {
          const activo = opcion.valor === filtro
          const total = datos?.totales[opcion.valor]
          return (
            <button
              key={opcion.valor}
              type="button"
              aria-pressed={activo}
              onClick={() => cambiarFiltro(opcion.valor)}
              className={`inline-flex h-9 px-4 items-center gap-2 rounded-full text-label-md transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                activo ? 'bg-on-surface text-surface font-semibold' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container shadow-sm'
              }`}
            >
              {opcion.label}
              {total !== undefined && (
                <span className={`text-[11px] tabular-nums px-1.5 rounded-full ${activo ? 'bg-surface/20' : 'bg-surface-container'}`}>
                  {total}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {(marcar.isError || marcarTodas.isError) && <EstadoError mensaje={contenido.actionError} />}

      {notificaciones.isPending && <EstadoCarga texto={contenido.loading} />}

      {notificaciones.isError && (
        <EstadoError
          mensaje={`${contenido.loadError} ${MENSAJES_ERROR_API[notificaciones.error.tipo]}`}
          onReintentar={() => void notificaciones.refetch()}
        />
      )}

      {datos &&
        (datos.notificaciones.length === 0 ? (
          <EstadoVacio icon="notifications_off" titulo={contenido.empty[filtro].title} descripcion={contenido.empty[filtro].description} />
        ) : (
          <ul className="flex flex-col gap-3" aria-live="polite">
            {datos.notificaciones.map((notificacion) => (
              <ItemNotificacion
                key={notificacion.id}
                notificacion={notificacion}
                onMarcarLeida={(id) => marcar.mutate(id)}
                marcando={marcar.isPending && marcar.variables === notificacion.id}
              />
            ))}
          </ul>
        ))}
    </div>
  )
}
