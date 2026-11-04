import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { registroContent } from '../../content/registro.content'
import { PasosRegistro } from '../PasosRegistro'

interface TarjetaRegistroProps {
  /** Índice de la etapa actual (0 = Datos básicos, 1 = Credenciales, 2 = Área de práctica). */
  pasoActual: number
  subtitle: string
  children: ReactNode
}

/** Tarjeta común del registro (A3, A3A, A4, A5): identidad, pasos, contenido y pie. */
export function TarjetaRegistro({ pasoActual, subtitle, children }: TarjetaRegistroProps) {
  const { brandName, title, steps, reassurance, links } = registroContent

  return (
    <div className="relative w-full max-w-[580px] bg-surface-container-lowest rounded-xl shadow-xl shadow-on-surface/5 p-6 sm:p-10 flex flex-col">
      {/* Identidad y encabezado */}
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20 text-on-primary">
            <Icon name="balance" size={24} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-headline-lg tracking-tight text-on-surface font-bold">{brandName}</span>
            <span className="w-2 h-2 rounded-full bg-primary-container" aria-hidden="true" />
          </div>
        </div>
        <h1 className="text-headline-md text-on-surface mt-5 tracking-tight">{title}</h1>
        <p className="text-body-md text-secondary mt-1.5 max-w-[430px]">{subtitle}</p>
      </div>

      <PasosRegistro pasoActual={pasoActual} />

      {children}

      {/* Nota de seguridad */}
      <div className="mt-6 pt-5 border-t border-surface-container flex items-center justify-between gap-3 text-secondary">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-surface-container flex items-center justify-center text-primary">
            <Icon name="verified_user" size={15} />
          </div>
          <span className="text-[11px] leading-tight">{reassurance}</span>
        </div>
        <span className="text-[11px] text-outline font-medium shrink-0">
          {steps.counter(pasoActual + 1, steps.items.length)}
        </span>
      </div>

      {/* Enlace a inicio de sesión */}
      <p className="mt-5 text-center text-body-sm text-secondary">
        {links.hasAccountText}{' '}
        <Link
          to={ROUTES.login}
          className="text-label-md text-primary font-semibold hover:underline ml-1 rounded focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
        >
          {links.loginLinkText}
        </Link>
      </p>
    </div>
  )
}
