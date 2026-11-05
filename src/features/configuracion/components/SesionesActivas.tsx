import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { formatearRelativa } from '@/lib/fechas'
import { configuracionContent } from '../content/configuracion.content'
import { useCerrarOtrasSesiones, useCerrarSesionRemota, useSesiones } from '../hooks/useConfiguracion'
import { botonSecundario } from './SeccionConfiguracion'

export function SesionesActivas() {
  const { sessions: textos } = configuracionContent
  const sesiones = useSesiones()
  const cerrar = useCerrarSesionRemota()
  const cerrarOtras = useCerrarOtrasSesiones()

  if (sesiones.isPending) return <EstadoCarga texto={textos.loading} />
  if (sesiones.isError) return <EstadoError mensaje={MENSAJES_ERROR_API[sesiones.error.tipo]} onReintentar={() => void sesiones.refetch()} />

  const otras = sesiones.data.filter((s) => !s.actual)
  const error = cerrar.error ?? cerrarOtras.error

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-2">
        {sesiones.data.map((s) => (
          <li key={s.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low">
            <Icon name={/iphone|android/i.test(s.dispositivo) ? 'smartphone' : 'computer'} size={24} className="text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-label-lg text-on-surface font-semibold">
                {s.dispositivo} · {s.navegador}
                {s.actual && <span className="ml-2 px-2 py-0.5 rounded-full bg-primary-container/15 text-primary text-label-sm">{textos.current}</span>}
              </p>
              <p className="text-body-sm text-secondary">
                {s.ubicacion} · {textos.lastActivity}: {formatearRelativa(s.ultimaActividad)}
              </p>
            </div>
            {!s.actual && (
              <button
                type="button"
                disabled={cerrar.isPending}
                onClick={() => cerrar.mutate(s.id)}
                aria-label={`${textos.close}: ${s.dispositivo}`}
                className="h-9 px-3 rounded-lg text-error text-label-md font-semibold hover:bg-error/10 disabled:opacity-60 cursor-pointer"
              >
                {cerrar.isPending && cerrar.variables === s.id ? textos.closing : textos.close}
              </button>
            )}
          </li>
        ))}
      </ul>
      {error && <EstadoError mensaje={MENSAJES_ERROR_API[error.tipo]} />}
      {otras.length > 0 ? (
        <button type="button" disabled={cerrarOtras.isPending} onClick={() => cerrarOtras.mutate()} className={botonSecundario}>
          <Icon name="logout" size={18} />
          {cerrarOtras.isPending ? textos.closing : textos.closeAll}
        </button>
      ) : (
        <p className="text-body-sm text-secondary">{textos.onlyCurrent}</p>
      )}
    </div>
  )
}
