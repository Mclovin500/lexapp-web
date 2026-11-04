import { Icon } from '@/components/ui/Icon'
import { contrasenaContent } from '../content/contrasena.content'
import { REGLAS_CONTRASENA } from '../schemas/contrasena.schema'

interface IndicadorContrasenaProps {
  contrasena: string
  id?: string
  /** `compacto`: requisitos en línea (A3). `lista`: requisitos en columna (A2D). */
  variante?: 'compacto' | 'lista'
}

/** Muestra en vivo qué requisitos de contraseña se cumplen. Lo usan A3 y A2D. */
export function IndicadorContrasena({
  contrasena,
  id,
  variante = 'compacto',
}: IndicadorContrasenaProps) {
  const { title, strength, rules, personalDataNote } = contrasenaContent
  const resultados = REGLAS_CONTRASENA.map((regla) => ({
    id: regla.id,
    cumple: regla.cumple(contrasena),
  }))
  const cumplidas = resultados.filter((r) => r.cumple).length
  const esLista = variante === 'lista'

  return (
    <div
      id={id}
      className={`rounded-lg flex flex-col gap-2 ${esLista ? '' : 'bg-surface-container-low/70 p-3'}`}
    >
      <div className="flex items-center justify-between gap-3 text-secondary">
        <span className="text-label-sm font-medium">{title}</span>
        <span className="text-label-sm text-primary font-semibold" aria-live="polite">
          {strength[cumplidas]}
        </span>
      </div>
      <div className="grid grid-cols-5 gap-1.5" aria-hidden="true">
        {resultados.map((resultado, indice) => (
          <div
            key={resultado.id}
            className={`h-1 rounded-full transition-colors ${
              indice < cumplidas ? 'bg-primary-container' : 'bg-surface-container-highest'
            }`}
          />
        ))}
      </div>
      <ul
        className={
          esLista ? 'flex flex-col gap-2.5 pt-1' : 'flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5'
        }
      >
        {resultados.map((resultado) => (
          <li
            key={resultado.id}
            className={`flex items-center gap-1.5 ${esLista ? 'text-body-sm' : 'text-[11px]'} ${
              resultado.cumple ? 'text-primary font-medium' : 'text-secondary'
            }`}
          >
            <Icon
              name={resultado.cumple ? 'check_circle' : 'radio_button_unchecked'}
              size={esLista ? 18 : 14}
            />
            {rules[resultado.id]}
          </li>
        ))}
      </ul>
      <p
        className={`flex items-start gap-1.5 text-secondary ${esLista ? 'text-body-sm pt-1' : 'text-[11px]'}`}
      >
        <Icon name="info" size={esLista ? 18 : 14} className="shrink-0" />
        <span>{personalDataNote}</span>
      </p>
    </div>
  )
}
