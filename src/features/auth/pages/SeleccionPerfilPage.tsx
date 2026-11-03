import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { CabeceraSeleccionPerfil } from '../components/CabeceraSeleccionPerfil'
import { TarjetaPerfil } from '../components/TarjetaPerfil'
import { seleccionPerfilContent } from '../content/seleccion-perfil.content'
import type { EstadoNavegacionPerfil, TipoPerfil } from '../types/perfil.types'

/** P03 → A3 (abogado) o P04 (cliente), según docs/flujo-navegacion.md */
const DESTINO_POR_PERFIL: Record<TipoPerfil, string> = {
  abogado: ROUTES.register,
  cliente: ROUTES.mobileApp,
}

export function SeleccionPerfilPage() {
  const navigate = useNavigate()
  const { intro, opciones, perfilPorDefecto, action, links, footer } = seleccionPerfilContent
  const [perfil, setPerfil] = useState<TipoPerfil>(perfilPorDefecto)

  const opcionActual = opciones.find((opcion) => opcion.tipo === perfil) ?? opciones[0]

  const handleSubmit = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    const estado: EstadoNavegacionPerfil = { tipoPerfil: perfil }
    navigate(DESTINO_POR_PERFIL[perfil], { state: estado })
  }

  return (
    <div className="relative flex flex-col w-full min-h-screen overflow-hidden bg-surface text-on-surface font-sans text-body-md antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* Resplandor ambiental superior */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-primary-container/10 blur-[120px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <CabeceraSeleccionPerfil />

      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-6 pt-6 pb-12 flex flex-col items-center justify-center">
        {/* Encabezado de página */}
        <div className="text-center max-w-xl mx-auto mb-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-primary text-label-sm tracking-wide uppercase mb-4 shadow-sm">
            <Icon name="how_to_reg" size={14} />
            <span>{intro.stepTag}</span>
          </div>
          <h1 className="text-display-lg text-on-surface tracking-tight mb-3">{intro.title}</h1>
          <p className="text-body-lg text-secondary leading-relaxed">{intro.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          {/* Tarjetas de perfil */}
          <fieldset className="w-full max-w-4xl mb-10">
            <legend className="sr-only">{intro.legend}</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {opciones.map((opcion) => (
                <TarjetaPerfil
                  key={opcion.tipo}
                  opcion={opcion}
                  seleccionada={opcion.tipo === perfil}
                  onSeleccionar={setPerfil}
                />
              ))}
            </div>
          </fieldset>

          {/* Acción principal */}
          <div className="flex flex-col items-center gap-3 w-full max-w-sm">
            <button
              type="submit"
              className="w-full h-12 bg-primary-container hover:bg-primary text-on-primary text-label-lg rounded-lg shadow-md hover:shadow-lg flex items-center justify-center gap-3 transition-all duration-150 active:scale-[0.99] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span>{opcionActual.continueLabel}</span>
              <Icon name="arrow_forward" size={20} />
            </button>
            <p className="text-label-sm text-secondary text-center" aria-live="polite">
              <span className="text-on-surface font-medium">{action.nextStepPrefix}</span>{' '}
              {opcionActual.nextStepHint}
            </p>
          </div>
        </form>

        {/* Enlace a inicio de sesión */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center gap-2 text-body-md text-secondary text-center">
          <span>{links.hasAccountText}</span>
          <Link
            to={ROUTES.login}
            className="text-label-lg text-primary hover:text-primary-container font-semibold transition-colors flex items-center gap-1 rounded focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
          >
            <span>{links.loginLinkText}</span>
            <Icon name="chevron_right" size={16} />
          </Link>
        </div>
      </main>

      {/* Pie institucional */}
      <footer className="relative z-10 w-full py-6 px-6 sm:px-12 bg-surface-container-lowest mt-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 text-secondary text-label-sm">
          <Icon name="verified" size={18} className="text-primary-container shrink-0" />
          <span>{footer.securityLabel}</span>
        </div>
        <div className="text-secondary text-label-sm text-center md:text-right">{footer.legal}</div>
      </footer>
    </div>
  )
}
