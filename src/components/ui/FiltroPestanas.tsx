interface OpcionFiltro<T extends string> {
  valor: T
  label: string
}

interface FiltroPestanasProps<T extends string> {
  opciones: OpcionFiltro<T>[]
  valor: T
  onCambiar: (valor: T) => void
  totales?: Partial<Record<T, number>>
  ariaLabel: string
}

/** Filtros por estado como botones conmutables (`aria-pressed`), con contador opcional. */
export function FiltroPestanas<T extends string>({ opciones, valor, onCambiar, totales, ariaLabel }: FiltroPestanasProps<T>) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {opciones.map((opcion) => {
        const activo = opcion.valor === valor
        const total = totales?.[opcion.valor]
        return (
          <button
            key={opcion.valor}
            type="button"
            aria-pressed={activo}
            onClick={() => onCambiar(opcion.valor)}
            className={`inline-flex h-9 px-4 items-center gap-2 rounded-full text-label-md transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              activo ? 'bg-on-surface text-surface font-semibold' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container shadow-sm'
            }`}
          >
            {opcion.label}
            {total !== undefined && (
              <span className={`text-[11px] tabular-nums px-1.5 rounded-full ${activo ? 'bg-surface/20' : 'bg-surface-container'}`}>
                {total}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
