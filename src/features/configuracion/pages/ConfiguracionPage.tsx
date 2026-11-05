import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import { CerrarSesion } from '../components/CerrarSesion'
import { DatosPersonalesSeccion } from '../components/FormularioDatosPersonales'
import { SeguridadSeccion } from '../components/FormularioContrasena'
import { PreferenciasNotificaciones } from '../components/PreferenciasNotificaciones'
import { PreferenciasPrivacidad } from '../components/PreferenciasPrivacidad'
import { ResumenCuentaDeposito, ResumenFinanciero, ResumenProfesional } from '../components/ResumenesConfiguracion'
import { SeccionConfiguracion } from '../components/SeccionConfiguracion'
import { SesionesActivas } from '../components/SesionesActivas'
import { configuracionContent } from '../content/configuracion.content'
import type { EstadoCuentaGuardada } from '../types/configuracion.types'

function esCuentaGuardada(valor: unknown): valor is EstadoCuentaGuardada {
  return typeof valor === 'object' && valor !== null && (valor as Record<string, unknown>).cuentaGuardada === true
}

/** J1: configuración de la cuenta. Cuenta de depósito → J1A · Cerrar sesión → P02. */
export function ConfiguracionPage() {
  const contenido = configuracionContent
  const navigate = useNavigate()
  const { state, pathname, hash } = useLocation()
  const [cuentaGuardada] = useState(() => esCuentaGuardada(state))

  // El aviso de J1A se muestra una vez; al recargar ya no aparece.
  useEffect(() => {
    if (esCuentaGuardada(state)) navigate({ pathname, hash }, { replace: true, state: null })
  }, [state, pathname, hash, navigate])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-headline-lg text-on-surface tracking-tight">{contenido.title}</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">{contenido.subtitle}</p>
      </div>
      {cuentaGuardada && (
        <p role="status" className="flex items-start gap-2 p-4 rounded-lg bg-primary-container/10 text-body-md text-primary">
          <Icon name="check_circle" size={20} className="shrink-0" />
          {contenido.savedAccount}
        </p>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <nav aria-label={contenido.nav.ariaLabel} className="xl:col-span-3 xl:sticky xl:top-24 p-3 rounded-xl bg-surface-container-lowest shadow-sm">
          <ul className="flex xl:flex-col gap-1 overflow-x-auto">
            {contenido.nav.items.map((item) => (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-label-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Icon name={item.icon} size={18} />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="xl:col-span-9 flex flex-col gap-6">
          <SeccionConfiguracion id="datos-personales" titulo={contenido.personal.title} descripcion={contenido.personal.description}>
            <DatosPersonalesSeccion />
          </SeccionConfiguracion>
          <SeccionConfiguracion id="seguridad" titulo={contenido.security.title} descripcion={contenido.security.description}>
            <SeguridadSeccion />
          </SeccionConfiguracion>
          <SeccionConfiguracion id="sesiones" titulo={contenido.sessions.title} descripcion={contenido.sessions.description}>
            <SesionesActivas />
          </SeccionConfiguracion>
          <SeccionConfiguracion id="notificaciones" titulo={contenido.notifications.title} descripcion={contenido.notifications.description}>
            <PreferenciasNotificaciones />
          </SeccionConfiguracion>
          <SeccionConfiguracion id="privacidad" titulo={contenido.privacy.title} descripcion={contenido.privacy.description}>
            <PreferenciasPrivacidad />
          </SeccionConfiguracion>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SeccionConfiguracion id="datos-profesionales" titulo={contenido.professional.title} descripcion={contenido.professional.description}>
              <ResumenProfesional />
            </SeccionConfiguracion>
            <SeccionConfiguracion id="financiero" titulo={contenido.financial.title} descripcion={contenido.financial.description}>
              <ResumenFinanciero />
            </SeccionConfiguracion>
          </div>
          <SeccionConfiguracion id="cuenta-deposito" titulo={contenido.deposit.title} descripcion={contenido.deposit.description}>
            <ResumenCuentaDeposito />
          </SeccionConfiguracion>
          <SeccionConfiguracion id="cerrar-sesion" titulo={contenido.logout.title} descripcion={contenido.logout.description}>
            <CerrarSesion />
          </SeccionConfiguracion>
        </div>
      </div>
    </div>
  )
}
