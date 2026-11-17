import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Icon } from '@/components/ui/Icon'
import { MensajeCampo } from '@/features/auth/components/CampoTexto'
import { asistenteContent } from '../content/asistente.content'

const MAXIMO_CARACTERES = 500

interface CampoAsistenteProps {
  onEnviar: (texto: string) => void
  deshabilitado: boolean
}

/** Campo de escritura del asistente: Enter envía, Shift + Enter agrega una línea. */
export function CampoAsistente({ onEnviar, deshabilitado }: CampoAsistenteProps) {
  const { composer } = asistenteContent
  const [texto, setTexto] = useState('')
  const [error, setError] = useState<string | null>(null)
  const entrada = useRef<HTMLTextAreaElement>(null)

  const mandar = (evento?: FormEvent) => {
    evento?.preventDefault()
    if (deshabilitado) return
    if (!texto.trim()) {
      setError(composer.empty)
      return
    }
    onEnviar(texto.trim())
    setTexto('')
    setError(null)
    entrada.current?.focus()
  }

  const alTeclear = (evento: KeyboardEvent<HTMLTextAreaElement>) => {
    if (evento.key === 'Enter' && !evento.shiftKey && !evento.nativeEvent.isComposing) {
      evento.preventDefault()
      mandar()
    }
  }

  return (
    <form onSubmit={mandar} className="flex flex-col gap-2 p-3 border-t border-surface-container bg-surface-container-lowest">
      <div className="flex items-end gap-2">
        <label htmlFor="asistente-mensaje" className="sr-only">
          {composer.label}
        </label>
        <textarea
          ref={entrada}
          id="asistente-mensaje"
          rows={1}
          value={texto}
          maxLength={MAXIMO_CARACTERES}
          onChange={(evento) => {
            setTexto(evento.target.value)
            setError(null)
          }}
          onKeyDown={alTeclear}
          placeholder={composer.placeholder}
          aria-describedby="asistente-mensaje-ayuda"
          className="flex-1 min-h-11 max-h-32 py-2.5 px-3 rounded-lg bg-surface-container-low text-body-md text-on-surface placeholder:text-outline resize-none focus:outline-none focus:ring-2 focus:ring-primary-container"
        />
        <button
          type="submit"
          disabled={deshabilitado}
          aria-label={composer.send}
          className="shrink-0 w-11 h-11 rounded-lg inline-flex items-center justify-center bg-primary-container hover:bg-primary-hover text-on-primary-container hover:text-on-primary disabled:opacity-60 disabled:cursor-wait cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Icon name="send" size={20} />
        </button>
      </div>
      <p id="asistente-mensaje-ayuda" className="text-[11px] text-secondary">
        {composer.hint}
      </p>
      {error && <MensajeCampo id="asistente-mensaje-error" mensaje={error} />}
    </form>
  )
}
