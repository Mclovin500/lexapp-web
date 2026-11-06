import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { BotonTema } from '@/components/ui/BotonTema'
import { Icon } from '@/components/ui/Icon'
import { FormularioLogin } from '../components/FormularioLogin'
import { PanelInstitucional } from '../components/PanelInstitucional'
import { loginContent } from '../content/login.content'

export function LoginPage() {
  return (
    <main className="w-full min-h-screen bg-surface text-on-surface font-body-md text-body-md antialiased selection:bg-primary-container selection:text-on-primary-container">
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-surface text-on-surface">
        {/* PANEL IZQUIERDO: Formulario de Acceso para Abogados */}
        <section className="flex flex-col justify-between px-6 sm:px-14 lg:px-20 py-10 bg-surface-container-lowest relative z-10 min-h-screen">
          {/* Navegación Superior, Logo y Formulario */}
          <div>
            {/* Navegación y Versión */}
            <div className="flex items-center justify-between mb-8">
              <Link
                to={ROUTES.home}
                className="inline-flex items-center gap-2 text-secondary hover:text-on-surface transition-colors font-label-md text-label-md rounded p-1 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
              >
                <Icon name="arrow_back" size={18} />
                <span>{loginContent.header.backToHome}</span>
              </Link>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-secondary font-semibold">
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                  <span>{loginContent.header.systemVersion}</span>
                </span>
                <BotonTema />
              </div>
            </div>

            {/* Logotipo */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-inverse-surface flex items-center justify-center text-primary-fixed shadow-sm">
                <Icon name="balance" size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface leading-none">
                  {loginContent.header.brandName}
                </span>
                <span className="font-label-sm text-label-sm tracking-widest text-primary font-bold uppercase mt-1">
                  {loginContent.header.brandSubtitle}
                </span>
              </div>
            </div>

            {/* Títulos de Bienvenida */}
            <div className="mb-8">
              <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight mb-2">
                {loginContent.welcome.title}
              </h1>
              <p className="font-body-md text-body-md text-secondary">
                {loginContent.welcome.subtitle}
              </p>
            </div>

            {/* Banner Informativo Exclusivo de Abogado */}
            <div className="p-3.5 mb-6 rounded-lg bg-surface-container-low flex items-start gap-3">
              <Icon
                name={loginContent.lawyerBanner.icon}
                size={20}
                className="text-primary shrink-0 mt-0.5"
              />
              <p className="font-label-sm text-label-sm text-on-surface leading-snug">
                {loginContent.lawyerBanner.prefix}
                <strong className="font-semibold text-primary">
                  {loginContent.lawyerBanner.highlight}
                </strong>
                {loginContent.lawyerBanner.suffix}
              </p>
            </div>

            {/* Formulario */}
            <FormularioLogin />
          </div>

          {/* Pie de página fiduciario y normativo */}
          <div className="pt-8 text-center mt-6">
            <div className="inline-flex items-center justify-center gap-2 py-1.5 px-3 rounded-full bg-surface-container-low text-secondary font-label-sm text-label-sm max-w-full">
              <Icon name="verified" size={16} className="text-primary shrink-0" />
              <span className="truncate sm:overflow-visible">
                {loginContent.footer.securityLabel}
              </span>
            </div>
            <div className="mt-2 text-secondary/70 font-label-sm text-label-sm">
              {loginContent.footer.copyright}
            </div>
          </div>
        </section>

        {/* PANEL DERECHO: Propuesta Institucional */}
        <PanelInstitucional />
      </div>
    </main>
  )
}

