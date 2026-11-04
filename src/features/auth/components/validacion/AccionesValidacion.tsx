import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { validacionProfesionalContent } from '../../content/validacion-profesional.content'
import type { EstadoValidacion } from '../../types/sesion.types'

interface AccionesValidacionProps {
  estado: EstadoValidacion
  onActualizar: () => void
  actualizando: boolean
}

interface AccionProps {
  icon: string
  label: string
  detail: string
  destacada?: boolean
}

const baseAccion =
  'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

function ContenidoAccion({ icon, label, detail, destacada = false }: AccionProps) {
  return (
    <>
      <span
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
          destacada ? 'bg-on-primary/15 text-on-primary' : 'bg-surface-container text-primary'
        }`}
      >
        <Icon name={icon} size={20} />
      </span>
      <span className="flex-1 min-w-0">
        <span className={`block text-label-lg font-semibold ${destacada ? 'text-on-primary' : 'text-on-surface'}`}>
          {label}
        </span>
        <span className={`block text-body-sm ${destacada ? 'text-on-primary/80' : 'text-secondary'}`}>{detail}</span>
      </span>
    </>
  )
}

function AccionEnlace({ to, ...props }: AccionProps & { to: string }) {
  return (
    <Link
      to={to}
      className={`${baseAccion} ${
        props.destacada
          ? 'bg-primary-container hover:bg-primary shadow-md'
          : 'bg-surface-container-lowest hover:bg-surface-container shadow-sm'
      }`}
    >
      <ContenidoAccion {...props} />
      <Icon name="chevron_right" size={20} className={props.destacada ? 'text-on-primary' : 'text-outline'} />
    </Link>
  )
}

/**
 * "Acciones disponibles" de A5A según el estado real:
 * - validado → B1.
 * - requiere_correccion y rechazado → corregir en A4 / A5 y reenviar desde A5.
 * - pendiente → consultar o actualizar A4 / A5.
 *   PENDIENTE backend: qué pasa con la revisión en curso si el abogado edita sus datos.
 * - En todos: actualizar estado.
 */
export function AccionesValidacion({ estado, onActualizar, actualizando }: AccionesValidacionProps) {
  const { actions } = validacionProfesionalContent
  const debeCorregir = estado === 'requiere_correccion' || estado === 'rechazado'

  return (
    <section aria-labelledby="acciones-validacion-titulo" className="rounded-xl bg-surface-container-low p-6">
      <h2 id="acciones-validacion-titulo" className="flex items-center gap-2 text-headline-sm text-on-surface mb-4">
        <Icon name="bolt" size={20} className="text-primary" />
        {actions.title}
      </h2>

      <div className="flex flex-col gap-2.5">
        {estado === 'validado' && (
          <AccionEnlace
            to={ROUTES.dashboard}
            icon="dashboard"
            label={actions.enterOffice}
            detail={actions.enterOfficeDetail}
            destacada
          />
        )}

        {debeCorregir && (
          <>
            <AccionEnlace
              to={ROUTES.registerCredentials}
              icon="badge"
              label={actions.fixCredentials}
              detail={actions.fixCredentialsDetail}
              destacada
            />
            <AccionEnlace
              to={ROUTES.registerProfile}
              icon="psychology"
              label={actions.editProfile}
              detail={actions.editProfileDetail}
            />
            <p className="flex items-start gap-1.5 px-1 text-body-sm text-secondary">
              <Icon name="info" size={16} className="shrink-0 mt-0.5" />
              {actions.resubmitNote}
            </p>
          </>
        )}

        {estado === 'pendiente' && (
          <>
            <AccionEnlace
              to={ROUTES.registerCredentials}
              icon="badge"
              label={actions.reviewCredentials}
              detail={actions.reviewCredentialsDetail}
            />
            <AccionEnlace
              to={ROUTES.registerProfile}
              icon="psychology"
              label={actions.reviewProfile}
              detail={actions.reviewProfileDetail}
            />
          </>
        )}

        <button
          type="button"
          onClick={onActualizar}
          disabled={actualizando}
          className={`${baseAccion} bg-surface-container-lowest hover:bg-surface-container shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          <ContenidoAccion
            icon="refresh"
            label={actualizando ? actions.refreshing : actions.refresh}
            detail={actions.refreshDetail}
          />
        </button>
      </div>
    </section>
  )
}
