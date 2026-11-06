import { useId, useRef } from 'react'
import { Icon } from '@/components/ui/Icon'
import { formatearTamano } from '@/lib/archivos'
import { MensajeCampo } from '../CampoTexto'

interface CampoArchivoRegistroProps {
  label: string
  hint: string
  accept: string
  /** Nombre y tamaño del archivo ya cargado; `null` = sin archivo. */
  actual: { nombre: string; tamanoBytes: number } | null
  cargando: boolean
  error?: string
  opcional?: string
  textos: { choose: string; change: string; remove: string; uploading: string }
  onElegir: (archivo: File) => void
  onQuitar: () => void
}

/** Carga de un archivo de A4/A5: se sube en cuanto se elige y muestra el resultado. */
export function CampoArchivoRegistro({ label, hint, accept, actual, cargando, error, opcional, textos, onElegir, onQuitar }: CampoArchivoRegistroProps) {
  const id = useId()
  const entrada = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-1.5">
      <p id={`${id}-etiqueta`} className="text-label-md text-on-surface font-medium">
        {label} {opcional && <span className="text-secondary font-normal">{opcional}</span>}
      </p>
      <input
        ref={entrada}
        type="file"
        accept={accept}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(evento) => {
          const archivo = evento.target.files?.[0]
          evento.target.value = ''
          if (archivo) onElegir(archivo)
        }}
      />
      <div
        role="group"
        aria-labelledby={`${id}-etiqueta`}
        aria-describedby={`${id}-ayuda`}
        className={`flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border border-dashed bg-surface-container-low ${error ? 'border-error' : 'border-outline-variant'}`}
      >
        <Icon name={actual ? 'task' : 'upload_file'} size={24} className="text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          {actual && (
            <p className="text-label-md text-on-surface font-semibold break-all">
              {actual.nombre}
              {actual.tamanoBytes > 0 && <span className="text-body-sm text-secondary font-normal"> · {formatearTamano(actual.tamanoBytes)}</span>}
            </p>
          )}
          <p id={`${id}-ayuda`} className="text-body-sm text-secondary">
            {cargando ? textos.uploading : hint}
          </p>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            disabled={cargando}
            onClick={() => entrada.current?.click()}
            className="h-9 px-3 inline-flex items-center gap-1.5 rounded-lg bg-surface-container-lowest text-on-surface text-label-md font-semibold shadow-sm hover:bg-surface-container disabled:opacity-60 cursor-pointer"
          >
            <Icon name="attach_file" size={18} />
            {actual ? textos.change : textos.choose}
          </button>
          {actual && (
            <button
              type="button"
              disabled={cargando}
              onClick={onQuitar}
              aria-label={`${textos.remove}: ${actual.nombre}`}
              className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-secondary hover:bg-surface-container disabled:opacity-60 cursor-pointer"
            >
              <Icon name="close" size={18} />
            </button>
          )}
        </div>
      </div>
      {error && <MensajeCampo id={`${id}-error`} mensaje={error} />}
    </div>
  )
}
