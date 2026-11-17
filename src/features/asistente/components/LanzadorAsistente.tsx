import { Icon } from '@/components/ui/Icon'
import { asistenteContent } from '../content/asistente.content'

interface LanzadorAsistenteProps {
  abierto: boolean
  onAlternar: () => void
}

/** Botón flotante (FAB) que abre y cierra el panel del asistente. */
export function LanzadorAsistente({ abierto, onAlternar }: LanzadorAsistenteProps) {
  return (
    <button
      type="button"
      onClick={onAlternar}
      aria-label={abierto ? asistenteContent.close : asistenteContent.open}
      aria-expanded={abierto}
      aria-controls="panel-asistente"
      className="fixed z-50 bottom-5 right-4 sm:right-6 w-14 h-14 rounded-full inline-flex items-center justify-center bg-primary-container text-on-primary-container shadow-lg shadow-paleta-marino/25 hover:bg-primary-hover hover:text-on-primary hover:scale-105 active:scale-95 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <Icon name={abierto ? 'close' : 'smart_toy'} size={26} filled />
    </button>
  )
}
