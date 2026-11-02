import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'
import { howItWorksContent } from '../content/inicio-publico.content'

export function HowItWorksSection() {
  return (
    <section
      id="como-funciona"
      className="w-full bg-surface-container-low py-space-2xl scroll-mt-20"
    >
      <Container className="flex flex-col gap-space-xl">
        {/* Encabezado Centrado */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center gap-space-xs">
          <Badge variant="surface">{howItWorksContent.badge}</Badge>
          <h2 className="text-headline-lg font-bold tracking-tight text-on-surface">
            {howItWorksContent.title}
          </h2>
          <p className="text-body-lg leading-relaxed text-on-surface-variant">
            {howItWorksContent.description}
          </p>
        </div>

        {/* Grid de 3 Pasos Modulares */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {howItWorksContent.steps.map((step) => (
            <div
              key={step.number}
              className="group relative flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-xl shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container text-primary transition-colors group-hover:bg-primary-container group-hover:text-on-primary">
                  <Icon name={step.icon} size={28} />
                </div>
                <span className="font-mono text-display-lg leading-none text-surface-container-highest">
                  {step.number}
                </span>
              </div>
              <div className="flex flex-col gap-space-xs">
                <h3 className="text-headline-sm font-semibold text-on-surface">{step.title}</h3>
                <p className="text-body-md leading-relaxed text-on-surface-variant">
                  {step.description}
                </p>
              </div>
              <div className="mt-auto flex items-center gap-2 pt-space-sm text-label-md font-medium text-primary">
                <span>{step.footer}</span>
                <Icon name="chevron_right" size={16} />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

