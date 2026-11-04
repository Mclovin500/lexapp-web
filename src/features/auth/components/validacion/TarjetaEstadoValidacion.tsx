import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { validacionProfesionalContent } from '../../content/validacion-profesional.content'
import type { EstadoValidacion } from '../../types/sesion.types'

interface TarjetaEstadoValidacionProps {
  estado: EstadoValidacion
  motivo?: string | null
}

const tonos: Record<EstadoValidacion, { caja: string; icono: string; insignia: string }> = {
  pendiente: {
    caja: 'bg-surface-container-low',
    icono: 'bg-secondary-container text-on-secondary-container',
    insignia: 'bg-secondary-container text-on-secondary-container',
  },
  validado: {
    caja: 'bg-primary-container/10',
    icono: 'bg-primary-container text-on-primary',
    insignia: 'bg-primary/10 text-primary',
  },
  requiere_correccion: {
    caja: 'bg-tertiary-fixed/30',
    icono: 'bg-tertiary-container text-on-tertiary-container',
    insignia: 'bg-tertiary/10 text-tertiary',
  },
  rechazado: {
    caja: 'bg-error-container/40',
    icono: 'bg-error-container text-on-error-container',
    insignia: 'bg-error/10 text-error',
  },
}

const botonPrimario =
  'inline-flex h-11 px-5 items-center justify-center gap-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-label-lg font-semibold shadow-md transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
const botonSecundario =
  'inline-flex h-11 px-5 items-center justify-center gap-2 rounded-lg bg-surface-container-lowest text-on-surface text-label-lg font-semibold shadow-sm hover:bg-surface-container transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

/** Estado real devuelto por el backend, con su mensaje y sus acciones. */
export function TarjetaEstadoValidacion({ estado, motivo }: TarjetaEstadoValidacionProps) {
  const { states, reasonLabel, actions } = validacionProfesionalContent
  const texto = states[estado]
  const tono = tonos[estado]

  return (
    <section aria-labelledby="estado-validacion-titulo" className={`rounded-xl p-6 ${tono.caja}`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tono.icono}`}>
          <Icon name={texto.icon} size={26} filled={estado === 'validado'} />
        </div>
        <div className="flex-1 min-w-0">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm uppercase tracking-wider font-semibold ${tono.insignia}`}
          >
            {texto.badge}
          </span>
          <h2 id="estado-validacion-titulo" className="mt-2 text-headline-md text-on-surface tracking-tight">
            {texto.title}
          </h2>
          <p className="mt-1.5 text-body-md text-on-surface-variant leading-relaxed">{texto.message}</p>
        </div>
      </div>

      {motivo && (estado === 'requiere_correccion' || estado === 'rechazado') && (
        <div className="mt-5 p-4 rounded-lg bg-surface-container-lowest">
          <p className="text-label-sm uppercase tracking-wider text-secondary font-semibold mb-1">{reasonLabel}</p>
          <p className="text-body-md text-on-surface">{motivo}</p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {estado === 'validado' && (
          <Link to={ROUTES.dashboard} replace className={botonPrimario}>
            {actions.enterOffice}
            <Icon name="arrow_forward" size={18} />
          </Link>
        )}

        {estado === 'requiere_correccion' && (
          <>
            <Link to={ROUTES.registerCredentials} className={botonPrimario}>
              <Icon name="badge" size={18} />
              {actions.fixCredentials}
            </Link>
            <Link to={ROUTES.registerProfile} className={botonSecundario}>
              <Icon name="psychology" size={18} />
              {actions.editProfile}
            </Link>
          </>
        )}

        {estado === 'rechazado' && (
          <>
            {/* El diseño ofrece aclaración y soporte, pero aún no existen: se muestran deshabilitados. */}
            <button type="button" disabled className={`${botonSecundario} opacity-60 cursor-not-allowed`}>
              <Icon name="rate_review" size={18} />
              {actions.clarification}
              <span className="text-label-sm text-secondary font-normal">· {actions.comingSoon}</span>
            </button>
            <button type="button" disabled className={`${botonSecundario} opacity-60 cursor-not-allowed`}>
              <Icon name="support_agent" size={18} />
              {actions.support}
              <span className="text-label-sm text-secondary font-normal">· {actions.comingSoon}</span>
            </button>
          </>
        )}
      </div>
    </section>
  )
}
