import { useState, type FormEvent } from 'react'
import { Icon } from './Icon'

interface BuscadorListadoProps {
  id: string
  label: string
  placeholder: string
  valorInicial: string
  onBuscar: (texto: string) => void
}

/** Búsqueda que se aplica al enviar (Enter o botón), no en cada tecla. */
export function BuscadorListado({ id, label, placeholder, valorInicial, onBuscar }: BuscadorListadoProps) {
  const [texto, setTexto] = useState(valorInicial)

  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    onBuscar(texto.trim())
  }

  return (
    <form role="search" onSubmit={enviar} className="relative flex-1 flex">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Icon name="search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
      <input
        id={id}
        type="search"
        value={texto}
        maxLength={100}
        onChange={(evento) => setTexto(evento.target.value)}
        placeholder={placeholder}
        className="w-full h-11 pl-10 pr-24 rounded-lg bg-surface-container-lowest shadow-sm text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-3 rounded-md bg-surface-container text-label-md text-on-surface hover:bg-surface-container-high cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Buscar
      </button>
    </form>
  )
}
