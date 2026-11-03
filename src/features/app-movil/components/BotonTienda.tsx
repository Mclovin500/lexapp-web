import type { EnlaceTienda } from '../types/app-movil.types'
import { LogoTienda } from './LogoTienda'

interface BotonTiendaProps {
  enlace: EnlaceTienda
  unavailableLabel: string
}

const baseStyles =
  'inline-flex items-center gap-3 bg-inverse-surface text-white px-5 py-3 rounded-xl shadow-md transition-all'

export function BotonTienda({ enlace, unavailableLabel }: BotonTiendaProps) {
  const contenido = (
    <>
      <LogoTienda tienda={enlace.tienda} />
      <span className="text-left flex flex-col">
        <span className="text-[10px] tracking-wider uppercase opacity-80 leading-none">
          {enlace.url ? enlace.caption : unavailableLabel}
        </span>
        <span className="text-[16px] font-bold tracking-tight text-white leading-tight">
          {enlace.name}
        </span>
      </span>
    </>
  )

  // Sin URL configurada: se muestra el botón, pero no es navegable.
  if (!enlace.url) {
    return (
      <span className={`${baseStyles} opacity-60 cursor-not-allowed`} aria-disabled="true">
        {contenido}
      </span>
    )
  }

  return (
    <a
      href={enlace.url}
      target="_blank"
      rel="noopener noreferrer"
      title={enlace.title}
      aria-label={enlace.title}
      className={`${baseStyles} hover:bg-black hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
    >
      {contenido}
    </a>
  )
}
