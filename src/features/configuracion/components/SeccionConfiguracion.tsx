import type { ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'

interface SeccionConfiguracionProps {
  id: string
  titulo: string
  descripcion?: string
  children: ReactNode
}

/** Tarjeta de J1 con ancla (`#id`) para el índice lateral. */
export function SeccionConfiguracion({ id, titulo, descripcion, children }: SeccionConfiguracionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="scroll-mt-24 p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-4">
      <div>
        <h2 id={`${id}-titulo`} className="text-headline-sm text-on-surface">
          {titulo}
        </h2>
        {descripcion && <p className="mt-1 text-body-sm text-secondary">{descripcion}</p>}
      </div>
      {children}
    </section>
  )
}

/** Aviso breve de éxito dentro de una sección. */
export function AvisoGuardado({ texto }: { texto: string }) {
  return (
    <p role="status" className="flex items-start gap-2 p-3 rounded-lg bg-primary-container/10 text-body-sm text-primary">
      <Icon name="check_circle" size={18} className="shrink-0" />
      {texto}
    </p>
  )
}

export const botonPrimario =
  'h-11 px-5 inline-flex items-center justify-center gap-2 self-start rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary-container hover:text-on-primary text-label-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
export const botonSecundario =
  'h-10 px-4 inline-flex items-center justify-center gap-2 self-start rounded-lg bg-surface-container text-on-surface text-label-md font-semibold hover:bg-surface-container-high disabled:opacity-60 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
