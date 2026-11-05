import type { ReactNode } from 'react'

interface SeccionExpedienteProps {
  id: string
  titulo: string
  subtitulo?: string
  accion?: ReactNode
  children: ReactNode
}

/** Tarjeta con título para las secciones de E2. */
export function SeccionExpediente({ id, titulo, subtitulo, accion, children }: SeccionExpedienteProps) {
  return (
    <section aria-labelledby={id} className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id={id} className="text-headline-sm text-on-surface">
            {titulo}
          </h2>
          {subtitulo && <p className="text-body-sm text-secondary">{subtitulo}</p>}
        </div>
        {accion}
      </div>
      {children}
    </section>
  )
}
