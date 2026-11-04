import { Navigate, useLocation } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { EtiquetaPaso } from '../components/compartidos/EtiquetaPaso'
import { MarcoAcceso } from '../components/MarcoAcceso'
import { ConfirmacionContrasena } from '../components/recuperacion/ConfirmacionContrasena'
import { FormularioNuevaContrasena } from '../components/recuperacion/FormularioNuevaContrasena'
import { nuevaContrasenaContent } from '../content/nueva-contrasena.content'
import { recuperacionContent } from '../content/recuperacion.content'
import { esEstadoContrasenaActualizada, esEstadoNuevaContrasena } from '../lib/estado-navegacion'

/**
 * A2D: nueva contraseña. Sin token en el estado → A2B.
 * El regreso va a P02 (no a A2C): el código ya se usó.
 */
export function NuevaContrasenaPage() {
  const { state } = useLocation()
  const actualizada = esEstadoContrasenaActualizada(state)

  if (!actualizada && !esEstadoNuevaContrasena(state)) {
    return <Navigate to={ROUTES.recoverPassword} replace />
  }

  const { title, description, codeValidated } = nuevaContrasenaContent

  return (
    <MarcoAcceso regreso={{ to: ROUTES.login, label: recuperacionContent.backToLogin }}>
      <div className="relative w-full max-w-5xl bg-surface-container-lowest rounded-xl shadow-xl shadow-on-surface/5 overflow-hidden">
        <div className="w-full bg-surface-container-low px-6 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-2">
          <EtiquetaPaso icon="key" label={recuperacionContent.steps.password} />
          {!actualizada && (
            <span className="flex items-center gap-1 text-label-sm text-primary font-semibold bg-primary/10 px-2.5 py-0.5 rounded-full">
              <Icon name="verified" size={15} />
              {codeValidated}
            </span>
          )}
        </div>

        <div className="p-6 sm:p-8">
          {actualizada ? (
            <ConfirmacionContrasena />
          ) : (
            <>
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary shadow-sm">
                  <Icon name="key_vertical" size={26} />
                </div>
                <div>
                  <h1 className="text-headline-lg text-on-surface tracking-tight">{title}</h1>
                  <p className="text-body-md text-on-surface-variant mt-1 leading-relaxed">{description}</p>
                </div>
              </div>
              {esEstadoNuevaContrasena(state) && (
                <FormularioNuevaContrasena tokenRestablecimiento={state.tokenRestablecimiento} />
              )}
            </>
          )}
        </div>
      </div>
    </MarcoAcceso>
  )
}
