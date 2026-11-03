import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { appMovilContent } from '../content/app-movil.content'

export function CabeceraAppMovil() {
  const { header } = appMovilContent

  return (
    <header className="relative z-20 w-full bg-surface-container-lowest shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link
          to={ROUTES.profileSelection}
          className="group inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-label-md rounded p-1 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
        >
          <Icon
            name="arrow_back"
            size={18}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          <span className="hidden md:inline">{header.backToProfileSelection}</span>
        </Link>

        {/* Logotipo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
            <Icon name="balance" size={24} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-headline-sm font-bold tracking-tight text-on-surface">
                {header.brandName}
              </span>
              <span className="bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
                {header.brandBadge}
              </span>
            </div>
            <span className="hidden sm:block text-on-surface-variant text-[11px] leading-tight">
              {header.brandSubtitle}
            </span>
          </div>
        </div>

        {/* Sellos de seguridad y versión */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant text-label-sm">
            <Icon name="shield_lock" size={14} className="text-primary" />
            <span className="tracking-wide uppercase">{header.securityBadge}</span>
          </div>
          <div className="hidden lg:block h-3 w-px bg-outline-variant" aria-hidden="true" />
          <span className="hidden lg:inline text-label-sm text-secondary tracking-wide">
            {header.systemVersion}
          </span>
        </div>
      </div>
    </header>
  )
}
