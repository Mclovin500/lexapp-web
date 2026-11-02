import { ROUTES } from '@/app/routes'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { closingBannerContent } from '../content/inicio-publico.content'

export function ClosingBanner() {
  return (
    <section className="w-full bg-surface-container-lowest py-space-2xl">
      <Container>
        <div className="relative flex flex-col items-center overflow-hidden rounded-2xl bg-surface-container-low p-space-lg sm:p-space-2xl text-center shadow-sm gap-space-lg">
          {/* Detalle ambiental sutil */}
          <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-primary-container/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-primary/5 blur-2xl" />

          <div className="relative z-10 flex max-w-2xl flex-col items-center gap-space-xs">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container text-primary">
              <Icon name="balance" size={28} />
            </div>
            <h2 className="text-headline-lg font-bold tracking-tight text-on-surface">
              {closingBannerContent.title}
            </h2>
            <p className="text-body-lg leading-relaxed text-on-surface-variant">
              {closingBannerContent.description}
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-space-md">
            <Button
              variant="secondary"
              size="md"
              to={ROUTES.login}
              className="h-11 px-6 bg-surface-container hover:bg-surface-container-highest text-on-surface"
            >
              {closingBannerContent.loginCta}
            </Button>
            <Button
              variant="primary"
              size="md"
              to={ROUTES.register}
              className="group h-11 px-7 shadow-md shadow-primary-container/20"
            >
              <span>{closingBannerContent.registerCta}</span>
              <Icon
                name="arrow_forward"
                size={18}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
