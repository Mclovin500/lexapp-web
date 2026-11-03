import { Icon } from '@/components/ui/Icon'
import { BotonTienda } from '../components/BotonTienda'
import { CabeceraAppMovil } from '../components/CabeceraAppMovil'
import { MaquetaTelefono } from '../components/MaquetaTelefono'
import { TarjetaBeneficio } from '../components/TarjetaBeneficio'
import { appMovilContent } from '../content/app-movil.content'

/**
 * P04: pantalla informativa para clientes. La plataforma web es exclusiva para abogados,
 * así que aquí solo se dirige al cliente a las tiendas (sin "Continuar en navegador").
 */
export function AppMovilPage() {
  const { intro, benefits, stores, trust, footer } = appMovilContent

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface text-on-surface font-sans text-body-md antialiased selection:bg-primary-container selection:text-on-primary-container">
      <CabeceraAppMovil />

      <main className="relative w-full max-w-7xl mx-auto px-6 py-8 lg:py-12 flex-1 overflow-x-clip">
        {/* Luces ambientales */}
        <div
          className="pointer-events-none absolute -top-12 right-1/4 w-96 h-96 bg-primary-fixed/30 rounded-full blur-3xl opacity-60"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-10 right-10 w-80 h-80 bg-surface-container-highest/50 rounded-full blur-3xl opacity-50"
          aria-hidden="true"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Columna izquierda: información, beneficios y tiendas */}
          <section className="lg:col-span-7 flex flex-col items-start space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-label-sm font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" aria-hidden="true" />
              {intro.tag}
            </div>

            <div className="space-y-3">
              <h1 className="text-display-lg text-on-surface leading-tight font-bold tracking-tight">
                {intro.title}
              </h1>
              <p className="text-body-lg text-on-surface font-medium leading-relaxed">{intro.lead}</p>
              <p className="text-body-md text-on-surface-variant leading-relaxed">{intro.description}</p>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
              {benefits.map((beneficio) => (
                <TarjetaBeneficio key={beneficio.title} {...beneficio} />
              ))}
            </div>

            <div className="w-full pt-2">
              <span className="block text-label-sm text-on-surface-variant uppercase tracking-wider mb-3 font-semibold">
                {stores.heading}
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {stores.links.map((enlace) => (
                  <BotonTienda
                    key={enlace.tienda}
                    enlace={enlace}
                    unavailableLabel={stores.unavailableLabel}
                  />
                ))}
              </div>
            </div>

            <div className="w-full mt-2 p-4 rounded-xl bg-surface-container-low shadow-sm flex items-start gap-4">
              <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                <Icon name="verified_user" size={24} />
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-on-surface">{trust.title}</h2>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">{trust.description}</p>
              </div>
            </div>
          </section>

          {/* Columna derecha: maqueta del teléfono */}
          <div className="lg:col-span-5">
            <MaquetaTelefono />
          </div>
        </div>
      </main>

      {/* Pie institucional */}
      <footer className="w-full bg-surface-container-lowest mt-auto py-5 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-body-sm text-secondary">
          <div className="flex items-center gap-2">
            <Icon name="verified" size={16} className="text-primary" />
            <span>{footer.copyright}</span>
          </div>
          <nav aria-label="Enlaces legales" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-label-md">
            {footer.links.map((enlace) =>
              enlace.href ? (
                <a
                  key={enlace.label}
                  href={enlace.href}
                  className="text-on-surface-variant hover:text-primary transition-colors"
                >
                  {enlace.label}
                </a>
              ) : (
                <span key={enlace.label} className="text-on-surface-variant">
                  {enlace.label}
                </span>
              ),
            )}
          </nav>
        </div>
      </footer>
    </div>
  )
}
