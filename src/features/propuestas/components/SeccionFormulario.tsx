import type { ReactNode } from 'react'

interface SeccionFormularioProps {
  numero: number
  titulo: string
  descripcion: string
  children: ReactNode
}

/** Sección numerada de un formulario largo (Stitch D1: "organizar el formulario en secciones"). */
export function SeccionFormulario({ numero, titulo, descripcion, children }: SeccionFormularioProps) {
  const id = `seccion-${numero}`
  return (
    <fieldset aria-labelledby={id} className="rounded-xl bg-surface-container-lowest shadow-sm p-6">
      <div className="flex items-start gap-3 mb-5">
        <span className="w-8 h-8 rounded-full bg-primary-container/15 text-primary text-label-md font-bold flex items-center justify-center shrink-0">
          {numero}
        </span>
        <div>
          <legend id={id} className="text-headline-sm text-on-surface">
            {titulo}
          </legend>
          <p className="text-body-sm text-secondary">{descripcion}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </fieldset>
  )
}
