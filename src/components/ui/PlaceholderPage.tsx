import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'

export interface PlaceholderPageProps {
  id: string
  title: string
}

export function PlaceholderPage({ id, title }: PlaceholderPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-gutter text-on-surface">
      <div className="flex w-full max-w-md flex-col items-center gap-space-md rounded-2xl bg-surface-container-lowest p-space-xl shadow-lg text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-low text-primary">
          <Icon name="construction" size={28} />
        </div>
        <h1 className="text-headline-sm font-semibold tracking-tight text-center">
          {id} — {title} (pendiente)
        </h1>
        <p className="text-body-md text-on-surface-variant text-center">
          Esta pantalla se encuentra en preparación y estará disponible próximamente.
        </p>
        <Link
          to={ROUTES.home}
          className="inline-flex items-center gap-space-xs rounded-lg bg-surface-container px-space-md py-2.5 text-label-lg text-on-surface transition-colors hover:bg-surface-container-high focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Icon name="arrow_back" size={18} />
          <span>Volver al inicio</span>
        </Link>
      </div>
    </div>
  )
}

