import { ROUTES } from '@/app/routes'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { heroContent } from '../content/inicio-publico.content'

function HeroDesktopMockup() {
  const { mockup } = heroContent

  return (
    <div className="relative flex w-full min-w-0 max-w-full items-center justify-center">
      {/* Contenedor Maqueta Desktop Legal Suite */}
      <div className="relative z-10 w-full min-w-0 max-w-full overflow-hidden rounded-xl bg-surface-container-lowest p-space-sm shadow-xl transition-all sm:overflow-visible sm:p-space-md hover:shadow-2xl">
        {/* Barra Superior del Sistema */}
        <div className="mb-space-sm flex items-center justify-between rounded-lg bg-surface-container-low px-space-sm py-space-xs sm:px-space-md gap-2">
          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-error" />
            <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-secondary" />
            <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary-container" />
            <span className="ml-1 truncate font-mono text-xs sm:text-label-sm text-on-surface-variant">
              {mockup.url}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 text-on-surface-variant">
            <Icon name="shield" size={16} className="text-primary-container" />
            <span className="font-mono text-xs sm:text-label-sm">{mockup.securityLabel}</span>
          </div>
        </div>

        {/* Interfaz Interna de la Maqueta */}
        <div className="flex flex-col sm:grid sm:grid-cols-12 gap-space-sm min-w-0">
          {/* Mini Barra Lateral */}
          <div className="col-span-3 hidden flex-col gap-space-sm rounded-lg bg-surface-container p-space-sm sm:flex">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-primary-container text-on-primary">
                <Icon name="balance" size={16} />
              </div>
              <span className="text-label-sm font-semibold text-on-surface">
                {mockup.panelName}
              </span>
            </div>
            <div className="my-1 h-px w-full bg-surface-container-highest" />
            <div className="flex flex-col gap-1">
              {mockup.menuItems.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2 rounded px-2 py-1.5 text-label-sm ${
                    item.active
                      ? 'bg-surface-container-lowest text-primary font-medium'
                      : 'text-on-surface-variant'
                  }`}
                >
                  <Icon name={item.icon} size={16} />
                  <span className="truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lienzo Central de Expediente */}
          <div className="col-span-12 flex min-w-0 flex-col gap-space-sm rounded-lg bg-surface-container-low p-space-sm sm:col-span-9 sm:p-space-md">
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="flex min-w-0 flex-col">
                <span className="text-label-sm uppercase tracking-wider text-on-surface-variant truncate">
                  {mockup.docketCategory}
                </span>
                <span className="text-base sm:text-headline-sm font-semibold text-on-surface truncate">
                  {mockup.docketTitle}
                </span>
              </div>
              <Badge variant="primary" className="shrink-0 text-[10px] sm:text-label-sm font-semibold">
                {mockup.docketStatus}
              </Badge>
            </div>

            {/* Gráfico de Estado Procesal */}
            <div className="flex min-w-0 flex-col gap-2 rounded-lg bg-surface-container-lowest p-space-sm shadow-sm">
              <div className="flex items-center justify-between text-on-surface">
                <span className="text-label-sm font-semibold">{mockup.progressTitle}</span>
                <span className="font-mono text-label-sm text-primary-container font-medium">
                  {mockup.progressPhase}
                </span>
              </div>
              <svg
                className="h-2 w-full overflow-hidden rounded-full"
                preserveAspectRatio="none"
                viewBox="0 0 100 8"
                aria-hidden="true"
              >
                <rect className="fill-surface-container" height="8" width="100" />
                <rect className="fill-primary-container" height="8" width="72" />
              </svg>
              <div className="grid grid-cols-4 gap-1 pt-1 text-[9px] sm:text-[10px] text-on-surface-variant">
                {mockup.progressSteps.map((step, idx) => (
                  <span
                    key={step}
                    className={`truncate ${idx === mockup.activeStepIndex ? 'font-semibold text-primary' : ''} ${
                      idx === mockup.progressSteps.length - 1 ? 'text-right' : ''
                    }`}
                  >
                    {step}
                  </span>
                ))}
              </div>
            </div>

            {/* Registro Documental Reciente */}
            <div className="flex min-w-0 items-center justify-between gap-2 rounded-lg bg-surface-container-lowest p-space-sm shadow-sm">
              <div className="flex min-w-0 items-center gap-space-xs">
                <Icon name="verified_user" size={20} className="shrink-0 text-primary" />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-label-sm font-semibold text-on-surface">
                    {mockup.recordTitle}
                  </span>
                  <span className="truncate text-body-sm text-[11px] text-on-surface-variant">
                    {mockup.recordSubtitle}
                  </span>
                </div>
              </div>
              <Icon name="check_circle" size={18} className="shrink-0 text-on-surface-variant" />
            </div>
          </div>
        </div>
      </div>

      {/* Tarjeta Flotante 1: Superior Derecha */}
      <div className="absolute -top-6 -right-4 z-20 hidden items-center gap-space-sm rounded-lg bg-surface-container-lowest px-space-md py-space-sm shadow-xl md:flex animate-bounce">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container/10 text-primary-container">
          <Icon name={mockup.floatingCardTop.icon} size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-label-sm font-semibold text-on-surface">
            {mockup.floatingCardTop.title}
          </span>
          <span className="text-body-sm text-[11px] text-on-surface-variant">
            {mockup.floatingCardTop.subtitle}
          </span>
        </div>
      </div>

      {/* Tarjeta Flotante 2: Inferior Izquierda */}
      <div className="absolute -bottom-6 -left-4 z-20 hidden items-center gap-space-sm rounded-lg bg-surface-container-lowest px-space-md py-space-sm shadow-xl md:flex">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-container text-tertiary">
          <Icon name={mockup.floatingCardBottom.icon} size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-label-sm font-semibold text-on-surface">
            {mockup.floatingCardBottom.title}
          </span>
          <span className="text-body-sm text-[11px] text-on-surface-variant">
            {mockup.floatingCardBottom.subtitle}
          </span>
        </div>
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section id="inicio" className="relative w-full overflow-hidden bg-surface py-space-2xl scroll-mt-20">
      {/* Fondos sutiles de profundidad arquitectónica */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-primary-container/5 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-20 h-80 w-80 rounded-full bg-surface-container/60 blur-2xl" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-space-2xl lg:grid-cols-12">
          {/* Columna Izquierda: Mensaje y Acciones */}
          <div className="flex flex-col gap-space-lg lg:col-span-6">
            {/* Badge de estatus fiduciario */}
            <div className="inline-flex w-fit items-center gap-space-xs rounded-full bg-surface-container px-3 py-1 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-primary-container animate-pulse" />
              <span className="text-label-sm uppercase tracking-wider text-on-surface font-semibold">
                {heroContent.badge}
              </span>
            </div>

            {/* Título H1 */}
            <div className="flex flex-col gap-space-xs">
              <h1 className="text-headline-lg sm:text-display-lg font-bold tracking-tight text-on-surface leading-tight">
                {heroContent.titlePart1} <br className="hidden sm:inline" />
                <span className="text-primary-container">{heroContent.titleHighlight}</span>
              </h1>
              <p className="mt-space-xs max-w-xl text-body-lg leading-relaxed text-on-surface-variant">
                {heroContent.description}
              </p>
            </div>

            {/* Llamados a la Acción */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-space-sm sm:gap-space-md pt-space-xs">
              <Button
                variant="primary"
                size="lg"
                to={ROUTES.profileSelection}
                className="group shadow-md shadow-primary-container/20 w-full sm:w-auto"
              >
                <span>{heroContent.primaryCta}</span>
                <Icon
                  name="arrow_forward"
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Button>
              <a
                href={heroContent.secondaryCtaHref}
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-space-xs rounded-lg bg-surface-container-lowest px-6 text-label-lg font-semibold text-on-surface shadow-sm transition-all duration-200 hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Icon name="play_circle" size={18} className="text-on-surface-variant" />
                <span>{heroContent.secondaryCta}</span>
              </a>
            </div>

            {/* Métricas de Confianza Institucional */}
            <div className="mt-space-xs grid grid-cols-3 gap-space-xs sm:gap-space-md pt-space-md">
              {heroContent.metrics.map((metric) => (
                <div key={metric.label} className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1">
                    {metric.icon && (
                      <Icon name={metric.icon} size={16} className="shrink-0 text-primary-container" />
                    )}
                    <span className="text-[15px] sm:text-headline-sm font-bold tracking-tight text-on-surface">
                      {metric.value}
                    </span>
                  </div>
                  <span className="mt-0.5 text-[10px] sm:text-label-sm uppercase tracking-wide text-on-surface-variant">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Mockup */}
          <div className="lg:col-span-6 min-w-0 max-w-full">
            <HeroDesktopMockup />
          </div>
        </div>
      </Container>
    </section>
  )
}
