import { Icon } from './Icon'

interface PaginacionProps {
  pagina: number
  porPagina: number
  total: number
  onCambiar: (pagina: number) => void
  etiqueta: string
}

const boton =
  'inline-flex h-9 min-w-9 px-2 items-center justify-center rounded-lg text-label-md transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

/** Paginación simple: "Mostrando 1-10 de 24" + anterior / páginas / siguiente. */
export function Paginacion({ pagina, porPagina, total, onCambiar, etiqueta }: PaginacionProps) {
  const totalPaginas = Math.max(1, Math.ceil(total / porPagina))
  const desde = total === 0 ? 0 : (pagina - 1) * porPagina + 1
  const hasta = Math.min(pagina * porPagina, total)

  return (
    <nav aria-label={`Paginación de ${etiqueta}`} className="flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-body-sm text-secondary">
        Mostrando <strong className="text-on-surface">{desde}–{hasta}</strong> de{' '}
        <strong className="text-on-surface">{total}</strong> {etiqueta}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className={`${boton} hover:bg-surface-container`}
          onClick={() => onCambiar(pagina - 1)}
          disabled={pagina <= 1}
          aria-label="Página anterior"
        >
          <Icon name="chevron_left" size={20} />
        </button>
        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
          <button
            key={numero}
            type="button"
            onClick={() => onCambiar(numero)}
            aria-current={numero === pagina ? 'page' : undefined}
            className={`${boton} ${
              numero === pagina ? 'bg-primary-container text-on-primary font-semibold' : 'hover:bg-surface-container text-on-surface'
            }`}
          >
            {numero}
          </button>
        ))}
        <button
          type="button"
          className={`${boton} hover:bg-surface-container`}
          onClick={() => onCambiar(pagina + 1)}
          disabled={pagina >= totalPaginas}
          aria-label="Página siguiente"
        >
          <Icon name="chevron_right" size={20} />
        </button>
      </div>
    </nav>
  )
}
