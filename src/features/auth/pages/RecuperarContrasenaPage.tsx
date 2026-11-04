import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { EtiquetaPaso } from '../components/compartidos/EtiquetaPaso'
import { TarjetaAcceso } from '../components/compartidos/TarjetaAcceso'
import { MarcoAcceso } from '../components/MarcoAcceso'
import { FormularioRecuperacion } from '../components/recuperacion/FormularioRecuperacion'
import { recuperacionContent } from '../content/recuperacion.content'
import { recuperarContrasenaContent } from '../content/recuperar-contrasena.content'

/** A2B: solicitud del código de recuperación. Siempre continúa a A2C. */
export function RecuperarContrasenaPage() {
  const { title, description, privacy, links, trustBadges } = recuperarContrasenaContent

  return (
    <MarcoAcceso regreso={{ to: ROUTES.login, label: recuperacionContent.backToLogin }}>
      <div className="w-full max-w-xl flex flex-col items-center">
        <TarjetaAcceso
          icon="vpn_key"
          title={title}
          description={<p>{description}</p>}
          ribbon={
            <div className="flex flex-wrap items-center justify-center gap-2">
              <EtiquetaPaso icon="shield" label={recuperacionContent.protocolBadge} />
              <EtiquetaPaso icon="looks_one" label={recuperacionContent.steps.request} />
            </div>
          }
        >
          <div className="mt-2 mb-7 bg-surface-container-low rounded-xl p-4 flex items-start gap-3.5">
            <Icon name="info" size={22} filled className="text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-label-sm uppercase tracking-wide text-on-surface font-semibold">
                {privacy.title}
              </span>
              <p className="text-body-sm text-on-surface-variant leading-relaxed">{privacy.text}</p>
            </div>
          </div>

          <FormularioRecuperacion />

          <p className="mt-8 text-center text-body-sm text-secondary">
            {links.rememberedText}{' '}
            <Link
              to={ROUTES.login}
              className="text-label-lg text-primary hover:underline ml-1 font-semibold rounded focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
            >
              {links.loginLinkText}
            </Link>
          </p>
        </TarjetaAcceso>

        <ul className="mt-8 w-full grid grid-cols-3 gap-3 sm:gap-4 text-center">
          {trustBadges.map((badge) => (
            <li key={badge.title} className="p-3 rounded-xl bg-surface-container-low flex flex-col items-center">
              <Icon name={badge.icon} size={22} className="text-secondary mb-1" />
              <span className="text-label-sm font-semibold text-on-surface">{badge.title}</span>
              <span className="text-body-sm text-secondary">{badge.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </MarcoAcceso>
  )
}
