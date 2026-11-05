import { useEffect, useId, useRef, type ReactNode } from 'react'
import { Icon } from './Icon'

interface DialogoProps {
  abierto: boolean
  onCerrar: () => void
  titulo: string
  descripcion?: string
  children: ReactNode
  ancho?: 'sm' | 'lg'
}

/** Modal nativo `<dialog>`: atrapa el foco, se cierra con Esc y devuelve el foco al cerrar. */
export function Dialogo({ abierto, onCerrar, titulo, descripcion, children, ancho = 'sm' }: DialogoProps) {
  const dialogo = useRef<HTMLDialogElement>(null)
  // Id único: puede haber varios diálogos en la misma pantalla.
  const tituloId = useId()

  useEffect(() => {
    const elemento = dialogo.current
    if (!elemento) return
    if (abierto && !elemento.open) elemento.showModal()
    if (!abierto && elemento.open) elemento.close()
  }, [abierto])

  return (
    <dialog
      ref={dialogo}
      onClose={onCerrar}
      aria-labelledby={tituloId}
      className={`m-auto ${ancho === 'lg' ? 'w-[min(44rem,calc(100%-2rem))]' : 'w-[min(32rem,calc(100%-2rem))]'} max-h-[calc(100%-2rem)] rounded-xl bg-surface-container-lowest p-0 text-on-surface shadow-2xl backdrop:bg-on-surface/40`}
    >
      <div className="p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={tituloId} className="text-headline-sm">
              {titulo}
            </h2>
            {descripcion && <p className="mt-1 text-body-sm text-secondary">{descripcion}</p>}
          </div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="w-9 h-9 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        {abierto && children}
      </div>
    </dialog>
  )
}
