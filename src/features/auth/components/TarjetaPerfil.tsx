import { Icon } from '@/components/ui/Icon'
import type { OpcionPerfil } from '../content/seleccion-perfil.content'
import type { TipoPerfil } from '../types/perfil.types'

interface TarjetaPerfilProps {
  opcion: OpcionPerfil
  seleccionada: boolean
  onSeleccionar: (tipo: TipoPerfil) => void
}

/**
 * Tarjeta seleccionable basada en un radio nativo oculto:
 * se puede elegir con clic, Tab y flechas del teclado.
 */
export function TarjetaPerfil({ opcion, seleccionada, onSeleccionar }: TarjetaPerfilProps) {
  const inputId = `perfil-${opcion.tipo}`
  const tituloId = `${inputId}-titulo`
  const descripcionId = `${inputId}-descripcion`

  return (
    <label
      htmlFor={inputId}
      className={`group relative flex flex-col justify-between w-full md:min-h-[430px] p-6 sm:p-8 rounded-xl cursor-pointer select-none transition-all duration-200 hover:shadow-xl has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary ${
        seleccionada ? 'bg-surface-container-low shadow-lg' : 'bg-surface-container-lowest shadow-md'
      }`}
    >
      <input
        type="radio"
        id={inputId}
        name="tipo-perfil"
        value={opcion.tipo}
        checked={seleccionada}
        onChange={() => onSeleccionar(opcion.tipo)}
        aria-labelledby={tituloId}
        aria-describedby={descripcionId}
        className="sr-only"
      />

      {/* Icono e indicador de selección */}
      <span className="flex items-start justify-between">
        <span
          className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${
            seleccionada ? 'bg-primary-container' : 'bg-surface-container-low'
          }`}
        >
          <Icon
            name={opcion.icon}
            size={28}
            className={seleccionada ? 'text-on-primary' : 'text-secondary'}
          />
        </span>
        <span
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
            seleccionada ? 'bg-primary-container' : 'bg-surface-container'
          }`}
        >
          {seleccionada && <Icon name="check" size={16} filled className="text-on-primary" />}
        </span>
      </span>

      {/* Título, descripción y características */}
      <span className="block my-4">
        <span className="flex flex-wrap items-center gap-2 mb-2">
          <span
            id={tituloId}
            className={`text-headline-md tracking-tight transition-colors ${
              seleccionada ? 'text-primary' : 'text-on-surface'
            }`}
          >
            {opcion.title}
          </span>
          <span
            className={`text-label-sm px-2 py-0.5 rounded-full ${
              opcion.destacada
                ? 'bg-primary/10 text-primary font-semibold'
                : 'bg-surface-container text-secondary'
            }`}
          >
            {opcion.tag}
          </span>
        </span>
        <span id={descripcionId} className="block text-body-md text-secondary leading-relaxed mb-5">
          {opcion.description}
        </span>
        <span className="block space-y-2.5">
          {opcion.features.map((feature) => (
            <span
              key={feature}
              className="flex items-center gap-2.5 text-body-sm text-on-surface-variant"
            >
              <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-primary-container" aria-hidden="true" />
              <span>{feature}</span>
            </span>
          ))}
        </span>
      </span>

      {/* Nota de plataforma */}
      <span className="flex items-center justify-between bg-surface-container-low px-4 py-2.5 rounded-lg">
        <span className="flex items-center gap-2">
          <Icon
            name={opcion.platformNote.icon}
            size={18}
            className={opcion.destacada ? 'text-primary' : 'text-secondary'}
          />
          <span
            className={`text-label-sm ${opcion.destacada ? 'text-on-surface' : 'text-secondary'}`}
          >
            {opcion.platformNote.label}
          </span>
        </span>
        <Icon
          name="arrow_forward"
          size={16}
          className={opcion.destacada ? 'text-primary' : 'text-secondary opacity-60'}
        />
      </span>
    </label>
  )
}
