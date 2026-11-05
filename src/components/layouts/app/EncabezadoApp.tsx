import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Avatar } from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'
import type { CuentaAbogado } from '@/features/dashboard/types/cuenta.types'
import { etiquetasShell } from './navegacion'

interface EncabezadoAppProps {
  cuenta?: CuentaAbogado
  onAbrirMenu: () => void
}

const botonIcono =
  'relative w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

function Insignia({ valor }: { valor: number }) {
  if (valor <= 0) return null
  return (
    <span
      aria-hidden="true"
      className="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 rounded-full bg-error text-on-error text-[10px] font-bold flex items-center justify-center"
    >
      {valor > 99 ? '99+' : valor}
    </span>
  )
}

/** Header único del panel: búsqueda, chat (H1), notificaciones (B1A) y perfil. */
export function EncabezadoApp({ cuenta, onAbrirMenu }: EncabezadoAppProps) {
  const notificaciones = cuenta?.contadores.notificacionesSinLeer ?? 0
  const mensajes = cuenta?.contadores.mensajesSinLeer ?? 0
  const nombre = cuenta ? [cuenta.tratamiento, cuenta.nombreCompleto].filter(Boolean).join(' ') : ''

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] flex items-center gap-4 px-4 sm:px-8">
      <button type="button" onClick={onAbrirMenu} aria-label={etiquetasShell.openMenu} className={`${botonIcono} lg:hidden`}>
        <Icon name="menu" size={22} />
      </button>

      {/* Búsqueda general: los módulos que busca aún no existen, por eso está deshabilitada. */}
      <div className="relative flex-1 max-w-md hidden sm:flex items-center">
        <Icon name="search" size={20} className="absolute left-3 text-outline pointer-events-none" />
        <input
          type="search"
          disabled
          aria-label={etiquetasShell.searchPlaceholder}
          placeholder={etiquetasShell.searchPlaceholder}
          className="w-full h-10 pl-10 pr-3 rounded-lg bg-surface-container-low text-body-md placeholder:text-outline disabled:cursor-not-allowed"
        />
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Link to={ROUTES.chat} aria-label={etiquetasShell.messages(mensajes)} className={botonIcono}>
          <Icon name="mail" size={22} />
          <Insignia valor={mensajes} />
        </Link>
        <Link to={ROUTES.notifications} aria-label={etiquetasShell.notifications(notificaciones)} className={botonIcono}>
          <Icon name="notifications" size={22} />
          <Insignia valor={notificaciones} />
        </Link>

        {cuenta && (
          <Link
            to={ROUTES.profile}
            aria-label={etiquetasShell.profile}
            className="ml-2 flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-surface-container-low transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Avatar nombre={cuenta.nombreCompleto} foto={cuenta.fotoUrl} size="sm" />
            <span className="hidden md:flex flex-col text-left">
              <span className="text-label-md text-on-surface font-semibold leading-tight">{nombre}</span>
              <span
                className={`text-[11px] leading-tight ${
                  cuenta.estadoValidacion === 'validado' ? 'text-primary' : 'text-secondary'
                }`}
              >
                {etiquetasShell.validation[cuenta.estadoValidacion]}
              </span>
            </span>
          </Link>
        )}
      </div>
    </header>
  )
}
