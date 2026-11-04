import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react'
import { codigoContent } from '../../content/codigo.content'

export const LONGITUD_CODIGO = 6

interface CampoCodigoProps {
  /** Valor controlado: string de 0 a 6 dígitos, sin huecos. */
  value: string
  onChange: (valor: string) => void
  /** Id del texto que etiqueta al grupo. */
  labelledBy: string
  describedBy?: string
  error?: boolean
  disabled?: boolean
  autoFocus?: boolean
}

function soloDigitos(texto: string): string {
  return texto.replace(/\D/g, '')
}

/** Seis casillas numéricas para un código de un solo uso. */
export function CampoCodigo({
  value,
  onChange,
  labelledBy,
  describedBy,
  error = false,
  disabled = false,
  autoFocus = false,
}: CampoCodigoProps) {
  const casillas = useRef<Array<HTMLInputElement | null>>([])

  const enfocar = (indice: number) => {
    const destino = Math.max(0, Math.min(indice, LONGITUD_CODIGO - 1))
    casillas.current[destino]?.focus()
    casillas.current[destino]?.select()
  }

  /** Escribe dígitos a partir de una posición, sin dejar huecos. */
  const escribirDesde = (indice: number, digitos: string) => {
    const inicio = Math.min(indice, value.length)
    const nuevo = (value.slice(0, inicio) + digitos + value.slice(inicio + digitos.length)).slice(
      0,
      LONGITUD_CODIGO,
    )
    onChange(nuevo)
    enfocar(inicio + digitos.length)
  }

  const handleChange = (indice: number, texto: string) => {
    const digitos = soloDigitos(texto)
    if (!digitos) return
    // Con autocompletado del sistema puede llegar el código completo en una sola casilla.
    escribirDesde(indice, digitos.length > 1 ? digitos : digitos.slice(-1))
  }

  const handleKeyDown = (indice: number, evento: KeyboardEvent<HTMLInputElement>) => {
    if (evento.key === 'Backspace') {
      evento.preventDefault()
      if (value[indice]) {
        onChange(value.slice(0, indice) + value.slice(indice + 1))
        enfocar(indice)
      } else if (indice > 0) {
        onChange(value.slice(0, indice - 1) + value.slice(indice))
        enfocar(indice - 1)
      }
    } else if (evento.key === 'ArrowLeft') {
      evento.preventDefault()
      enfocar(indice - 1)
    } else if (evento.key === 'ArrowRight') {
      evento.preventDefault()
      enfocar(Math.min(indice + 1, value.length))
    }
  }

  const handlePaste = (indice: number, evento: ClipboardEvent<HTMLInputElement>) => {
    evento.preventDefault()
    const digitos = soloDigitos(evento.clipboardData.getData('text')).slice(0, LONGITUD_CODIGO)
    if (digitos) escribirDesde(indice, digitos)
  }

  /** No se puede saltar a una casilla posterior a la primera vacía. */
  const handleFocus = (indice: number) => {
    if (indice > value.length) enfocar(value.length)
    else casillas.current[indice]?.select()
  }

  return (
    <div
      role="group"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      className="flex items-center justify-center gap-2 sm:gap-3"
    >
      {Array.from({ length: LONGITUD_CODIGO }, (_, indice) => (
        <div key={indice} className="flex items-center gap-2 sm:gap-3">
          {indice === LONGITUD_CODIGO / 2 && (
            <span className="w-2.5 h-0.5 bg-outline-variant rounded-full mx-1" aria-hidden="true" />
          )}
          <input
            ref={(elemento) => {
              casillas.current[indice] = elemento
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={indice === 0 ? 'one-time-code' : 'off'}
            autoFocus={autoFocus && indice === 0}
            aria-label={codigoContent.digitAriaLabel(indice + 1, LONGITUD_CODIGO)}
            aria-invalid={error}
            disabled={disabled}
            value={value[indice] ?? ''}
            placeholder="•"
            onChange={(evento) => handleChange(indice, evento.target.value)}
            onKeyDown={(evento) => handleKeyDown(indice, evento)}
            onPaste={(evento) => handlePaste(indice, evento)}
            onFocus={() => handleFocus(indice)}
            className={`w-11 h-14 sm:w-14 sm:h-16 text-center text-headline-md text-on-surface rounded-lg shadow-sm transition-all placeholder:text-outline-variant focus:outline-none focus:bg-surface-container-lowest focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed ${
              error
                ? 'bg-error-container/40 ring-1 ring-error focus:ring-error'
                : 'bg-surface-container-low focus:ring-primary-container'
            }`}
          />
        </div>
      ))}
    </div>
  )
}
