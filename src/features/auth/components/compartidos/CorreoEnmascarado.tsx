import { Icon } from '@/components/ui/Icon'

interface CorreoEnmascaradoProps {
  correo: string
}

/** Píldora con el correo parcialmente oculto tal como lo devolvió el backend. */
export function CorreoEnmascarado({ correo }: CorreoEnmascaradoProps) {
  return (
    <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-surface-container-low rounded-lg text-on-surface text-label-lg shadow-sm">
      <Icon name="alternate_email" size={18} className="text-secondary" />
      <span className="tracking-wide break-all">{correo}</span>
    </div>
  )
}
