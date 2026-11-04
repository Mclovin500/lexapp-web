import { Icon } from '@/components/ui/Icon'
import { codigoContent, minutosDesdeSegundos } from '../../content/codigo.content'

interface NotaVigenciaProps {
  /** Vigencia del código en segundos, tal como la devolvió el backend. */
  expiraEnSegundos: number
}

export function NotaVigencia({ expiraEnSegundos }: NotaVigenciaProps) {
  return (
    <p className="text-label-sm text-secondary/80 flex items-center justify-center gap-1.5">
      <Icon name="schedule" size={15} className="text-secondary" />
      <span>{codigoContent.validity(minutosDesdeSegundos(expiraEnSegundos))}</span>
    </p>
  )
}
