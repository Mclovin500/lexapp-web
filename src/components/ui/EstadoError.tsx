import { Icon } from './Icon'

interface EstadoErrorProps {
  mensaje: string
  textoReintentar?: string
  onReintentar?: () => void
}

/** Error de carga con botón opcional para reintentar. */
export function EstadoError({ mensaje, textoReintentar = 'Reintentar', onReintentar }: EstadoErrorProps) {
  return (
    <div
      role="alert"
      className="w-full p-4 rounded-lg bg-error-container text-on-error-container text-body-sm flex flex-wrap items-center gap-3 border border-error/20"
    >
      <Icon name="error" size={20} className="text-error shrink-0" />
      <span className="flex-1 min-w-0">{mensaje}</span>
      {onReintentar && (
        <button
          type="button"
          onClick={onReintentar}
          className="font-semibold underline hover:opacity-80 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
        >
          {textoReintentar}
        </button>
      )}
    </div>
  )
}
