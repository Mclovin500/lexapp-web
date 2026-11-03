import { ROUTES } from '@/app/routes'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { forLawyersContent } from '../content/inicio-publico.content'

function LawyerOfficeMockup() {
  const { mockup } = forLawyersContent

  return (
    <div className="order-2 flex w-full min-w-0 max-w-full items-center justify-center lg:order-1 lg:col-span-5">
      <div className="flex w-full min-w-0 max-w-full flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-sm sm:p-space-lg shadow-xl">
        {/* Barra superior de la maqueta */}
        <div className="flex items-center justify-between rounded-lg bg-surface-container-low px-space-md py-space-xs pb-space-xs">
          <div className="flex items-center gap-2">
            <Icon name="assignment" size={20} className="text-primary" />
            <span className="text-label-md font-semibold text-on-surface">
              {mockup.headerTitle}
            </span>
          </div>
          <span className="rounded bg-primary-container/10 px-2 py-0.5 font-mono text-label-sm text-primary-container">
            {mockup.statusText}
          </span>
        </div>

        {/* Métricas clave */}
        <div className="grid grid-cols-2 gap-space-sm">
          {mockup.metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex flex-col rounded-lg bg-surface-container p-space-sm"
            >
              <span
                className={`text-headline-sm font-bold ${
                  metric.highlight ? 'text-primary-container' : 'text-on-surface'
                }`}
              >
                {metric.value}
              </span>
              <span className="text-label-sm text-on-surface-variant">{metric.label}</span>
            </div>
          ))}
        </div>

        {/* Términos y Audiencias */}
        <div className="flex flex-col gap-space-xs">
          <span className="text-label-sm uppercase font-semibold text-on-surface">
            {mockup.deadlinesTitle}
          </span>
          {mockup.deadlines.map((deadline) => (
            <div
              key={deadline.title}
              className="flex items-center justify-between gap-2 rounded-lg bg-surface-container-low p-space-sm"
            >
              <div className="flex min-w-0 items-center gap-2">
                <Icon
                  name={deadline.icon}
                  size={18}
                  className={`shrink-0 ${deadline.variant === 'error' ? 'text-error' : 'text-tertiary'}`}
                />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-label-sm font-medium text-on-surface">
                    {deadline.title}
                  </span>
                  <span className="truncate text-body-sm text-[11px] text-on-surface-variant">
                    {deadline.subtitle}
                  </span>
                </div>
              </div>
              <Badge variant={deadline.variant} className="shrink-0 px-2 py-1 text-xs">
                {deadline.tag}
              </Badge>
            </div>
          ))}
        </div>

        {/* Propuesta con NOM-151 / e.firma */}
        <div className="flex items-center justify-between rounded-lg bg-surface-container-lowest p-space-sm shadow-sm">
          <div className="flex items-center gap-2">
            <Icon name={mockup.proposal.icon} size={20} className="text-primary" />
            <div className="flex flex-col">
              <span className="text-label-sm font-semibold text-on-surface">
                {mockup.proposal.title}
              </span>
              <span className="text-body-sm text-[11px] text-on-surface-variant">
                {mockup.proposal.subtitle}
              </span>
            </div>
          </div>
          <span className="font-mono text-label-md font-bold tabular-nums text-primary">
            {mockup.proposal.amount}
          </span>
        </div>
      </div>
    </div>
  )
}

export function ForLawyersSection() {
  return (
    <section id="para-abogados" className="w-full bg-surface-container-low py-space-2xl scroll-mt-20">
      <Container>
        <div className="grid grid-cols-1 items-center gap-space-2xl lg:grid-cols-12">
          {/* Columna Izquierda: Mockup */}
          <LawyerOfficeMockup />

          {/* Columna Derecha: Beneficios para Abogados */}
          <div className="order-1 flex flex-col gap-space-lg lg:order-2 lg:col-span-7">
            <div className="flex flex-col gap-space-xs">
              <Badge variant="default" className="w-fit">
                <Icon
                  name={forLawyersContent.badgeIcon}
                  size={16}
                  className="text-primary-container"
                />
                <span>{forLawyersContent.badge}</span>
              </Badge>
              <h2 className="text-headline-lg font-bold tracking-tight text-on-surface">
                {forLawyersContent.title}
              </h2>
              <p className="text-body-lg leading-relaxed text-on-surface-variant">
                {forLawyersContent.description}
              </p>
            </div>

            {/* 5 Beneficios Estructurados */}
            <div className="flex flex-col gap-space-sm">
              {forLawyersContent.benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="flex items-start gap-space-sm rounded-xl bg-surface-container-lowest p-space-sm shadow-sm"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-container text-primary-container">
                    <Icon name={benefit.icon} size={18} />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-label-lg font-semibold text-on-surface">{benefit.title}</h3>
                    <p className="text-body-sm text-on-surface-variant">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Botón de Registro para Abogados */}
            <div className="pt-space-xs">
              <Button
                variant="primary"
                size="lg"
                to={ROUTES.profileSelection}
                className="group shadow-md shadow-primary-container/20"
              >
                <span>{forLawyersContent.cta.text}</span>
                <Icon
                  name="arrow_forward"
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
