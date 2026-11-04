import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import { accesoContent } from '../content/acceso.content'

interface MarcoAccesoProps {
  children: ReactNode
  /** Brillo central animado (A1) o estático (A3). */
  brilloAnimado?: boolean
  /** Enlace de regreso en la cabecera (sustituye al lema). Lo usan A2A–A2D. */
  regreso?: {
    to: string
    label: string
  }
}

/** Marco visual compartido por A1, A2A–A2D y A3: fondo, cabecera y pie institucional. */
export function MarcoAcceso({ children, brilloAnimado = false, regreso }: MarcoAccesoProps) {
  const { header, footer } = accesoContent

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-surface font-sans text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* Fondo: retícula de puntos y luces ambientales */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(var(--color-on-surface)_1px,transparent_1px)] bg-size-[28px_28px]" />
        <div
          className={`absolute top-1/2 left-1/2 w-[680px] h-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-tr from-primary-container/10 via-primary-container/5 to-transparent blur-3xl ${
            brilloAnimado ? 'animate-brillo-suave motion-reduce:animate-none' : ''
          }`}
        />
        <div className="absolute -top-32 right-10 w-96 h-96 rounded-full bg-primary-fixed/20 blur-3xl" />
        <div className="absolute -bottom-32 left-10 w-96 h-96 rounded-full bg-surface-container-highest/40 blur-3xl" />
      </div>

      {/* Cabecera */}
      <header className="relative z-10 w-full pt-8 sm:pt-10 px-6 sm:px-12 flex justify-between items-center text-label-sm uppercase text-outline select-none">
        {regreso ? (
          <Link
            to={regreso.to}
            className="group inline-flex items-center gap-2 normal-case text-label-lg text-secondary hover:text-on-surface transition-colors py-2 px-3 -ml-3 rounded-lg hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
          >
            <Icon name="arrow_back" size={18} className="transition-transform group-hover:-translate-x-0.5" />
            <span>{regreso.label}</span>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-primary-container" aria-hidden="true" />
            <span className="tracking-widest">{header.tagline}</span>
          </div>
        )}
        <div className="flex items-center gap-6">
          <span className="hidden md:inline font-medium">{header.edition}</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-surface-container-lowest border border-outline-variant/40 text-secondary shadow-sm normal-case">
            {header.version}
          </span>
        </div>
      </header>

      {/* Contenido */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-8">
        {children}
      </main>

      {/* Pie */}
      <footer className="relative z-10 w-full px-6 sm:px-12 pt-5 pb-8 border-t border-outline-variant/30 flex flex-col md:flex-row gap-3 justify-between items-center text-body-sm text-outline">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span className="flex items-center gap-1.5 text-secondary font-medium">
            <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            {footer.encryption}
          </span>
          <span className="text-outline-variant" aria-hidden="true">•</span>
          <span>{footer.compliance}</span>
        </div>
        <span className="text-center">{footer.copyright}</span>
      </footer>
    </div>
  )
}
