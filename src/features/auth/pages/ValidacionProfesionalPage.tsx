import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { AlertaError } from '../components/compartidos/AlertaError'
import { MensajeError } from '../components/compartidos/MensajeError'
import { MarcoAcceso } from '../components/MarcoAcceso'
import { AccionesValidacion } from '../components/validacion/AccionesValidacion'
import { DatosExpediente } from '../components/validacion/DatosExpediente'
import { FuncionesRestringidas } from '../components/validacion/FuncionesRestringidas'
import { TarjetaEstadoValidacion } from '../components/validacion/TarjetaEstadoValidacion'
import { validacionProfesionalContent } from '../content/validacion-profesional.content'
import { useValidacionProfesional } from '../hooks/useValidacionProfesional'

/**
 * A5A: estado real de la validación (GET /abogado/validacion).
 * Izquierda: estado, mensaje y datos enviados. Derecha: acciones disponibles y,
 * en `pendiente`, las funciones restringidas hasta la aprobación.
 */
export function ValidacionProfesionalPage() {
  const contenido = validacionProfesionalContent
  const validacion = useValidacionProfesional()
  const datos = validacion.data
  const actualizando = validacion.isFetching && !validacion.isPending
  const actualizar = () => void validacion.refetch()

  return (
    <MarcoAcceso>
      <div className="w-full max-w-5xl bg-surface-container-lowest rounded-xl shadow-xl shadow-on-surface/5 p-6 sm:p-8">
        {/* Encabezado */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
            <Icon name="assignment_ind" size={26} />
          </div>
          <div>
            <h1 className="text-headline-lg text-on-surface tracking-tight">{contenido.title}</h1>
            <p className="text-body-md text-on-surface-variant mt-1">{contenido.subtitle}</p>
          </div>
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
                  onClick={actualizar}
                  className="font-semibold underline hover:opacity-80 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                >
                  {contenido.errors.retry}
                </button>
              </>
            )}
          </AlertaError>
        )}

        {datos && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 flex flex-col gap-6">
              {validacion.isError && (
                <AlertaError>
                  <MensajeError tipo={validacion.error.tipo} mensajes={contenido.errors} />
                </AlertaError>
              )}
              <TarjetaEstadoValidacion estado={datos.estado} motivo={datos.motivo} />
              <DatosExpediente validacion={datos} />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6">
              <AccionesValidacion
                estado={datos.estado}
                onActualizar={actualizar}
                actualizando={actualizando}
              />
              {datos.estado === 'pendiente' && <FuncionesRestringidas />}
            </div>
          </div>
        )}
      </div>
    </MarcoAcceso>
  )
}
