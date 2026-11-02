import { ROUTES } from '@/app/routes'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { forClientsContent } from '../content/inicio-publico.content'

function ClientPhoneMockup() {
  const { phoneMockup } = forClientsContent

  return (
    <div className="flex w-full min-w-0 max-w-full items-center justify-center lg:col-span-5">
      <div className="relative w-full max-w-[340px] sm:max-w-sm overflow-hidden rounded-2xl bg-surface-container-lowest p-space-sm sm:p-space-md shadow-xl">
        {/* Barra superior del smartphone ficticio */}
        <div className="mb-space-sm flex items-center justify-between rounded-lg bg-surface-container-low px-space-xs pb-space-sm">
          <span className="font-mono text-label-sm text-on-surface">{phoneMockup.time}</span>
          <div className="flex items-center gap-1.5 text-on-surface">
            <Icon name="signal_cellular_4_bar" size={14} />
            <Icon name="wifi" size={14} />
            <Icon name="battery_full" size={14} />
          </div>
        </div>

        {/* Contenido de la Pantalla Móvil */}
        <div className="flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-body-sm text-on-surface-variant">
                {phoneMockup.greeting}
              </span>
              <h3 className="text-headline-sm font-semibold text-on-surface">
                {phoneMockup.userName}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-primary-container">
              <Icon name="notifications" size={20} />
            </div>
          </div>

          {/* Tarjeta de Estado Activo en Celular */}
          <div className="flex flex-col gap-2 rounded-xl bg-surface-container-low p-space-sm">
            <div className="flex items-center justify-between">
              <span className="text-label-sm font-semibold text-primary">
                {phoneMockup.activeCaseNumber}
              </span>
              <span className="rounded-full bg-primary-container/10 px-2 py-0.5 text-[10px] font-semibold text-primary-container">
                {phoneMockup.activeCaseStatus}
              </span>
            </div>
            <span className="text-label-lg font-semibold text-on-surface">
              {phoneMockup.activeCaseTitle}
            </span>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-highest text-xs font-bold text-on-surface">
                {phoneMockup.lawyerInitials}
              </div>
              <span className="text-body-sm text-on-surface-variant">
                {phoneMockup.lawyerName}
              </span>
            </div>
          </div>

          {/* Selector de Especialistas */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-label-sm uppercase font-semibold text-on-surface">
              {phoneMockup.specialistsLabel}
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {phoneMockup.specialists.map((specialist) => (
                <div
                  key={specialist.label}
                  className="flex shrink-0 items-center gap-2 rounded-lg bg-surface-container-low px-3 py-2"
                >
                  <Icon name={specialist.icon} size={18} className="text-primary" />
                  <span className="text-label-sm text-on-surface">{specialist.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mensaje Seguro Rápido */}
          <div className="flex items-center gap-3 rounded-xl bg-primary-container/5 p-space-sm">
            <Icon
              name={phoneMockup.encryptedNotice.icon}
              size={20}
              className="text-primary-container"
            />
            <div className="flex flex-col">
              <span className="text-label-sm font-semibold text-on-surface">
                {phoneMockup.encryptedNotice.title}
              </span>
              <span className="text-body-sm text-[11px] text-on-surface-variant">
                {phoneMockup.encryptedNotice.subtitle}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ForClientsSection() {
  return (
    <section id="para-clientes" className="w-full bg-surface py-space-2xl scroll-mt-20">
      <Container>
        <div className="grid grid-cols-1 items-center gap-space-2xl lg:grid-cols-12">
          {/* Columna Izquierda: Contenido y Beneficios */}
          <div className="flex flex-col gap-space-lg lg:col-span-7">
            <div className="flex flex-col gap-space-xs">
              <Badge variant="default" className="w-fit">
                <Icon
                  name={forClientsContent.badgeIcon}
                  size={16}
                  className="text-primary-container"
                />
                <span>{forClientsContent.badge}</span>
              </Badge>
              <h2 className="text-headline-lg font-bold tracking-tight text-on-surface">
                {forClientsContent.title}
              </h2>
              <p className="text-body-lg leading-relaxed text-on-surface-variant">
                {forClientsContent.description}
              </p>
            </div>

            {/* 4 Beneficios en Lista Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              {forClientsContent.benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="flex flex-col gap-space-xs rounded-xl bg-surface-container-lowest p-space-md shadow-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-low text-primary-container">
                    <Icon name={benefit.icon} size={20} />
                  </div>
                  <h3 className="text-label-lg font-semibold text-on-surface">{benefit.title}</h3>
                  <p className="text-body-sm text-on-surface-variant">{benefit.description}</p>
                </div>
              ))}
            </div>

            {/* Botón de Acción */}
            <div className="pt-space-xs">
              <Button
                variant="secondary"
                size="md"
                to={ROUTES.register}
                className="h-11 px-6 bg-surface-container-lowest hover:bg-surface-container text-on-surface"
              >
                <Icon
                  name={forClientsContent.cta.icon}
                  size={20}
                  className="text-primary-container"
                />
                <span>{forClientsContent.cta.text}</span>
              </Button>
            </div>
          </div>

          {/* Columna Derecha: Mockup Smartphone */}
          <ClientPhoneMockup />
        </div>
      </Container>
    </section>
  )
}
