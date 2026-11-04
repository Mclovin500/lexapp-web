import { useId } from 'react'
import { Icon } from '@/components/ui/Icon'
import type { OpcionCatalogo } from '../../content/catalogos.content'
import { MensajeCampo } from '../CampoTexto'

interface SelectorEtiquetasProps {
  label: string
  hint?: string
  opciones: OpcionCatalogo[]
  value: string[]
  onChange: (valores: string[]) => void
  maximo: number
  error?: string
}

/** Selección múltiple con botones conmutables (`aria-pressed`). */
export function SelectorEtiquetas({
  label,
  hint,
  opciones,
  value,
  onChange,
  maximo,
  error,
}: SelectorEtiquetasProps) {
  const id = useId()
  const idEtiqueta = `${id}-etiqueta`
  const idAyuda = `${id}-ayuda`
  const idError = `${id}-error`
  const lleno = value.length >= maximo

  const alternar = (valor: string) => {
    onChange(value.includes(valor) ? value.filter((v) => v !== valor) : [...value, valor])
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span id={idEtiqueta} className="flex items-center gap-2 text-label-md text-on-surface font-medium">
          <Icon name="sell" size={18} className="text-secondary" />
          {label}
        </span>
        {hint && (
          <span id={idAyuda} className="text-label-sm text-secondary tabular-nums">
            {value.length}/{maximo} · {hint}
          </span>
        )}
      </div>
      <div
        role="group"
        aria-labelledby={idEtiqueta}
        aria-describedby={[hint ? idAyuda : '', error ? idError : ''].filter(Boolean).join(' ') || undefined}
        className="flex flex-wrap gap-2"
      >
        {opciones.map((opcion) => {
          const activa = value.includes(opcion.valor)
          const bloqueada = lleno && !activa

          return (
            <button
              key={opcion.valor}
              type="button"
              aria-pressed={activa}
              disabled={bloqueada}
              onClick={() => alternar(opcion.valor)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-sm transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                activa
                  ? 'bg-primary-container/15 text-primary font-semibold ring-1 ring-primary-container/40'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <Icon name={activa ? 'check' : 'add'} size={14} />
              {opcion.etiqueta}
            </button>
          )
        })}
      </div>
      {error && <MensajeCampo id={idError} mensaje={error} />}
    </div>
  )
}
