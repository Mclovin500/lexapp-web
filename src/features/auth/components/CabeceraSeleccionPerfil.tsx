import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { seleccionPerfilContent } from '../content/seleccion-perfil.content'

export function CabeceraSeleccionPerfil() {
  const { header } = seleccionPerfilContent

  return (
    <header className="relative z-10 w-full px-6 sm:px-12 py-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 sm:gap-8">
        <Link
          to={ROUTES.home}
          className="group flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-label-lg font-label-lg rounded p-1 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
        >
          <Icon
            name="arrow_back"
            size={18}
            className="transition-transform group-hover:-translate-x-1"
          />
          <span className="hidden sm:inline">{header.backToHome}</span>
        </Link>

        <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" aria-hidden="true" />

        {/* Logotipo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-on-surface flex items-center justify-center shadow-sm">
            <Icon name="balance" size={20} filled className="text-primary-container" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-headline-sm font-bold tracking-tight text-on-surface">
                {header.brandName}
              </span>
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
                {header.brandBadge}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-secondary uppercase tracking-[0.14em] -mt-0.5">
              {header.brandSubtitle}
            </span>
          </div>
        </div>
      </div>

      {/* Sellos de seguridad y versión */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full shadow-sm">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" aria-hidden="true" />
          <span className="text-label-sm text-on-surface tracking-wide uppercase">
            {header.securityBadge}
          </span>
          <Icon name="verified_user" size={14} className="text-primary" />
        </div>
        <div className="hidden lg:flex items-center gap-1.5 bg-surface-container-low text-secondary px-3 py-1.5 rounded-full text-label-sm">
          <Icon name="code" size={15} />
          <span>{header.systemVersion}</span>
        </div>
      </div>
    </header>
  )
}
