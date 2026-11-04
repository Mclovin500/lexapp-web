import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { AlertaError } from '../components/compartidos/AlertaError'
import { MensajeError } from '../components/compartidos/MensajeError'
import { MarcoAcceso } from '../components/MarcoAcceso'
import { DatosExpediente } from '../components/validacion/DatosExpediente'
import { FuncionesRestringidas } from '../components/validacion/FuncionesRestringidas'
import { TarjetaEstadoValidacion } from '../components/validacion/TarjetaEstadoValidacion'
import { validacionProfesionalContent } from '../content/validacion-profesional.content'
import { useValidacionProfesional } from '../hooks/useValidacionProfesional'

/**
 * A5A: estado real de la validación (GET /abogado/validacion).
 * validado → B1 · requiere_correccion → A4 / A5 · pendiente y rechazado: informativo.
 */
export function ValidacionProfesionalPage() {
  const contenido = validacionProfesionalContent
  const validacion = useValidacionProfesional()
  const datos = validacion.data
  const actualizando = validacion.isFetching && !validacion.isPending

  return (
    <MarcoAcceso>
      <div className="w-full max-w-5xl bg-surface-container-lowest rounded-xl shadow-xl shadow-on-surface/5 p-6 sm:p-8">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
              <Icon name="assignment_ind" size={26} />
            </div>
            <div>
              <h1 className="text-headline-lg text-on-surface tracking-tight">{contenido.title}</h1>
              <p className="text-body-md text-on-surface-variant mt-1">{contenido.subtitle}</p>
            </div>
          </div>
          {!validacion.isPending && (
            <button
              type="button"
              onClick={() => void validacion.refetch()}
              disabled={validacion.isFetching}
              className="inline-flex h-10 px-4 items-center justify-center gap-2 rounded-lg bg-surface-container text-on-surface text-label-lg font-semibold hover:bg-surface-container-high transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Icon name="refresh" size={18} className={actualizando ? 'animate-spin motion-reduce:animate-none' : ''} />
              {actualizando ? contenido.refreshing : contenido.refresh}
            </button>
          )}
        </div>

        {validacion.isPending && (
          <div role="status" className="py-16 flex flex-col items-center gap-3 text-body-sm text-secondary">
            <span
              className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary-container border-t-transparent"
              aria-hidden="true"
            />
            {contenido.loading}
          </div>
        )}

        {validacion.isError && !datos && (
          <AlertaError>
            <MensajeError
              tipo={validacion.error.tipo}
              mensajes={contenido.errors}
              enlaces={{ sesion_expirada: { to: ROUTES.login, label: contenido.errors.loginLink } }}
            />
            {validacion.error.tipo !== 'sesion_expirada' && (
              <>
                {' '}
                <button
                  type="button"
                  onClick={() => void validacion.refetch()}
                  className="font-semibold underline hover:opacity-80 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                >
                  {contenido.errors.retry}
                </button>
              </>
            )}
          </AlertaError>
        )}

        {datos && (
          <div className={`grid grid-cols-1 gap-6 ${datos.estado === 'validado' ? '' : 'lg:grid-cols-12'}`}>
            <div className={`flex flex-col gap-6 ${datos.estado === 'validado' ? '' : 'lg:col-span-8'}`}>
              {validacion.isError && (
                <AlertaError>
                  <MensajeError tipo={validacion.error.tipo} mensajes={contenido.errors} />
                </AlertaError>
              )}
              <TarjetaEstadoValidacion estado={datos.estado} motivo={datos.motivo} />
              <DatosExpediente validacion={datos} />
            </div>
            {datos.estado !== 'validado' && (
              <div className="lg:col-span-4">
                <FuncionesRestringidas />
              </div>
            )}
          </div>
        )}
      </div>
    </MarcoAcceso>
  )
}
