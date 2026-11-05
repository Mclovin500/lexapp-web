import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { Icon } from '@/components/ui/Icon'
import { MensajeCampo } from '@/features/auth/components/CampoTexto'
import { REGLAS_ARCHIVO } from '@/features/expedientes/content/documentos.content'
import { extensionArchivo, formatearTamano } from '@/lib/archivos'
import { chatContent } from '../content/chat.content'
import { useEnviarMensaje } from '../hooks/useChat'

const MAXIMO_CARACTERES = 2000

function validarArchivo(archivo: File): string | null {
  if (!REGLAS_ARCHIVO.extensiones.includes(extensionArchivo(archivo.name))) return 'Formato no permitido. Usa PDF, Word, Excel, JPG o PNG.'
  if (archivo.size === 0) return 'El archivo está vacío.'
  if (archivo.size > REGLAS_ARCHIVO.maximoBytes) return `El archivo pesa ${formatearTamano(archivo.size)}; el máximo es 20 MB.`
  return null
}

/** "Campo para escribir" y "Adjuntar archivo" de H1. */
export function CampoMensaje({ conversacionId }: { conversacionId: string }) {
  const { composer } = chatContent
  const enviar = useEnviarMensaje(conversacionId)
  const [texto, setTexto] = useState('')
  const [archivo, setArchivo] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const entrada = useRef<HTMLInputElement>(null)

  const mandar = (evento?: FormEvent) => {
    evento?.preventDefault()
    if (enviar.isPending) return
    if (!texto.trim() && !archivo) {
      setError(composer.empty)
      return
    }
    if (texto.length > MAXIMO_CARACTERES) {
      setError(composer.tooLong)
      return
    }
    enviar.mutate(
      { texto: texto.trim(), archivo },
      {
        onSuccess: () => {
          setTexto('')
          setArchivo(null)
          setError(null)
        },
      },
    )
  }

  const alTeclear = (evento: KeyboardEvent<HTMLTextAreaElement>) => {
    if (evento.key === 'Enter' && !evento.shiftKey && !evento.nativeEvent.isComposing) {
      evento.preventDefault()
      mandar()
    }
  }

  const mensajeError = error ?? (enviar.error ? MENSAJES_ERROR_API[enviar.error.tipo] : null)

  return (
    <form onSubmit={mandar} className="flex flex-col gap-2 p-3 border-t border-surface-container bg-surface-container-lowest">
      {archivo && (
        <div className="flex items-center gap-2 self-start max-w-full px-3 py-1.5 rounded-lg bg-surface-container-low text-body-sm">
          <Icon name="attach_file" size={16} className="text-primary shrink-0" />
          <span className="truncate">{archivo.name}</span>
          <span className="text-secondary shrink-0">{formatearTamano(archivo.size)}</span>
          <button
            type="button"
            onClick={() => setArchivo(null)}
            aria-label={composer.removeAttachment}
            className="shrink-0 w-6 h-6 rounded-full inline-flex items-center justify-center text-secondary hover:bg-surface-container cursor-pointer"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
      <div className="flex items-end gap-2">
        <input
          ref={entrada}
          type="file"
          accept={REGLAS_ARCHIVO.accept}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(evento) => {
            const elegido = evento.target.files?.[0] ?? null
            evento.target.value = ''
            if (!elegido) return
            const problema = validarArchivo(elegido)
            setError(problema)
            if (!problema) setArchivo(elegido)
          }}
        />
        <button
          type="button"
          onClick={() => entrada.current?.click()}
          aria-label={composer.attach}
          title={composer.attach}
          className="shrink-0 w-11 h-11 rounded-lg inline-flex items-center justify-center text-secondary hover:bg-surface-container hover:text-on-surface cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Icon name="attach_file" size={22} />
        </button>
        <label htmlFor="chat-mensaje" className="sr-only">
          {composer.label}
        </label>
        <textarea
          id="chat-mensaje"
          rows={1}
          value={texto}
          maxLength={MAXIMO_CARACTERES}
          onChange={(evento) => {
            setTexto(evento.target.value)
            setError(null)
          }}
          onKeyDown={alTeclear}
          placeholder={composer.placeholder}
          aria-describedby="chat-mensaje-ayuda"
          className="flex-1 min-h-11 max-h-40 py-2.5 px-3 rounded-lg bg-surface-container-low text-body-md text-on-surface placeholder:text-outline resize-y focus:outline-none focus:ring-2 focus:ring-primary-container"
        />
        <button
          type="submit"
          disabled={enviar.isPending}
          className="shrink-0 h-11 px-4 rounded-lg inline-flex items-center gap-2 bg-primary-container hover:bg-primary text-on-primary text-label-lg font-semibold disabled:opacity-60 disabled:cursor-wait cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Icon name="send" size={18} />
          <span className="hidden sm:inline">{enviar.isPending ? composer.sending : composer.send}</span>
        </button>
      </div>
      <p id="chat-mensaje-ayuda" className="text-[11px] text-secondary">
        {composer.hint}
      </p>
      {mensajeError && <MensajeCampo id="chat-mensaje-error" mensaje={mensajeError} />}
    </form>
  )
}
