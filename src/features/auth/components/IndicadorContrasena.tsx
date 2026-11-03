import { Icon } from '@/components/ui/Icon'
import { registroContent } from '../content/registro.content'
import { REGLAS_CONTRASENA } from '../schemas/registro.schema'

interface IndicadorContrasenaProps {
  contrasena: string
  id?: string
}

/** Muestra en vivo qué requisitos de contraseña se cumplen. */
export function IndicadorContrasena({ contrasena, id }: IndicadorContrasenaProps) {
  const { passwordMeter, passwordRules } = registroContent
  const resultados = REGLAS_CONTRASENA.map((regla) => ({
    id: regla.id,
    cumple: regla.cumple(contrasena),
  }))
  const cumplidas = resultados.filter((r) => r.cumple).length

  return (
    <div id={id} className="bg-surface-container-low/70 rounded-lg p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between text-secondary">
        <span className="text-label-sm font-medium">{passwordMeter.title}</span>
        <span className="text-label-sm text-primary font-semibold" aria-live="polite">
          {passwordMeter.strength[cumplidas]}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2" aria-hidden="true">
        {resultados.map((resultado, indice) => (
          <div
            key={resultado.id}
            className={`h-1 rounded-full transition-colors ${
              indice < cumplidas ? 'bg-primary-container' : 'bg-surface-container-highest'
            }`}
          />
        ))}
      </div>
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5">
        {resultados.map((resultado) => (
          <li
            key={resultado.id}
            className={`flex items-center gap-1 text-[11px] ${
              resultado.cumple ? 'text-primary' : 'text-secondary'
            }`}
          >
            <Icon name={resultado.cumple ? 'check_circle' : 'radio_button_unchecked'} size={14} />
            {passwordRules[resultado.id]}
          </li>
        ))}
      </ul>
    </div>
  )
}
