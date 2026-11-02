import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'
import { featuresContent, type FeatureItem } from '../content/inicio-publico.content'

function FeatureCard({ feature }: { feature: FeatureItem }) {
  return (
    <div className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-lg shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container-low text-primary-container">
        <Icon name={feature.icon} size={26} />
      </div>
      <h3 className="text-headline-sm font-semibold text-on-surface">{feature.title}</h3>
      <p className="text-body-md leading-relaxed text-on-surface-variant">
        {feature.description}
      </p>
    </div>
  )
}

export function FeaturesSection() {
  const topFeatures = featuresContent.features.slice(0, 3)
  const bottomFeatures = featuresContent.features.slice(3)

  return (
    <section id="caracteristicas" className="w-full bg-surface py-space-2xl scroll-mt-20">
      <Container className="flex flex-col gap-space-xl">
        {/* Encabezado Centrado */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center gap-space-xs">
          <Badge variant="default" className="text-primary font-semibold">
            {featuresContent.badge}
          </Badge>
          <h2 className="text-headline-lg font-bold tracking-tight text-on-surface">
            {featuresContent.title}
          </h2>
          <p className="text-body-lg leading-relaxed text-on-surface-variant">
            {featuresContent.description}
          </p>
        </div>

        {/* Grid de 5 Tarjetas Balanceadas (3 Arriba, 2 Abajo Centradas) */}
        <div className="flex flex-col gap-space-lg">
          {/* Fila Superior de 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            {topFeatures.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>

          {/* Fila Inferior de 2 Centradas */}
          <div className="mx-auto grid w-full max-w-4xl grid-cols-1 md:grid-cols-2 gap-space-lg">
            {bottomFeatures.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
