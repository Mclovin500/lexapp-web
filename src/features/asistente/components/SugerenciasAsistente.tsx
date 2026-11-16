import { asistenteContent } from '../content/asistente.content'
import type { SugerenciaAsistente } from '../types/asistente.types'

interface SugerenciasAsistenteProps {
  sugerencias: readonly SugerenciaAsistente[]
  onElegir: (sugerencia: SugerenciaAsistente) => void
  visible: boolean
}

/** Chips de pregunta rápida que se muestran al inicio de la conversación. */
export function SugerenciasAsistente({ sugerencias, onElegir, visible }: SugerenciasAsistenteProps) {
  if (!visible) return null

  return (
    <div className="flex flex-wrap gap-2 px-4 pb-1" role="group" aria-label={asistenteContent.welcome.hint}>
      {sugerencias.map((sugerencia) => (
        <button
          key={sugerencia.valor}
          type="button"
          onClick={() => onElegir(sugerencia)}
          className="px-3 py-1.5 rounded-full border border-outline-variant bg-surface-container-lowest text-label-md text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary-container/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {sugerencia.etiqueta}
        </button>
      ))}
    </div>
  )
}
